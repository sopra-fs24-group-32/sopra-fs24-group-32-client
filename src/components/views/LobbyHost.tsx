import React, { useEffect, useState } from "react";
import { handleError, api } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";
import Lobby from "models/Lobby";
import SockJS from "sockjs-client";
//import Stomp from "stompjs";
import { over } from "stompjs";
import { getDomain } from "helpers/getDomain";
import QRCode from "qrcode";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

const LobbyDetailHost = () => {
  const navigate = useNavigate();
  let amtOfConnectionTries = 0;
  const { id } = useParams();
  const [lobby, setLobby] = useState(new Lobby());
  const [stompClient, setStompClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    maxAmtUsers: 5,
    amtOfRounds: 2,
    timeLimit: 30,
  });
  const [imgUrl, setImgUrl] = useState("");

  const fetchLobby = async () => {
    try {
      const response = await api.get(`/lobby/${id}`);
      setLobby(response.data);

      setFormData({
        maxAmtUsers: response.data.maxAmtUsers || 50,
        amtOfRounds: response.data.amtOfRounds || 5,
        timeLimit: response.data.timeLimit || 60,
      });
      const qrCodeDataUrl = QRCode.toDataURL(response.data.lobbyInvitationCode);
      qrCodeDataUrl.then((data) => {
        setImgUrl(data);
      });
    } catch (error) {
      console.error(
        `Something went wrong while fetching the lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
      navigate("/home");
    }
  };

  const connectAndSubscribeUserToSocket = async () => {
    const sock = new SockJS(getDomain() + "/ws");
    const client = over(sock, { websocket: { withCredentials: false } });
    setStompClient(client);
  };

  const leaveLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      await api.post(`/lobby/leave/${id}`, { userToken });
    } catch (error) {
      console.error(
        `Something went wrong while leaving the lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert("");
    }
  };

  //WEBSOCKET SUBSCRIPTION
  useEffect(() => {
    connectAndSubscribeUserToSocket();
  }, []);

  useEffect(() => {
    const onConnect = () => {
      if (stompClient) {
        // Subscribe to public messages
        const subPublic = stompClient.subscribe(
          `/game/public/${id}`,
          onMessageReceived
        );

        // Subscribe to join messages
        const subJoin = stompClient.subscribe(`/game/join/${id}`, joinMessage);

        //const subLeave = client.subscribe("/game/leave", onMessageReceived3);
        const subLeave = stompClient.subscribe(
          `/game/leave/${id}`,
          leaveMessage
        );

        //const subLeave = client.subscribe("/game/leave", onMessageReceived3);
        const subKick = stompClient.subscribe(`/game/kick/${id}`, kickMessage);

        // Send the user token to server to register this client
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
          stompClient.send(`/game/lobby/join/${id}`, {}, userToken);
        }
      }
    };

    const onError = (error) => {
      if (amtOfConnectionTries < 5) {
        amtOfConnectionTries += 1;
        connectAndSubscribeUserToSocket();
      } else {
        console.log("Connection with websocket failed multiple times");
        console.log("Error:", error);
      }
    };

    const onMessageReceived = (payload) => {
      const username = localStorage.getItem("username");

      const body = JSON.parse(payload.body);

      const nextPictureGenerator = body.username;

      if (username === nextPictureGenerator) {
        stompClient.disconnect();
        navigate(`/game/create/${id}`);
      } else {
        stompClient.disconnect();
        navigate(`/game/guess/${id}`, {
          state: { nextPictureGenerator: nextPictureGenerator },
        });
      }
    };

    const joinMessage = (payload) => {
      const data = JSON.parse(payload.body);
      console.log("Join message received:", data);

      // Update the state to include the new user
      setLobby((prevLobby) => {
        // Check if the user is already in the list
        if (prevLobby.users.some((user) => user.id === data.id)) {
          console.log("User already in lobby:", data.username);

          return prevLobby;
        }
        const newUsersList = [...prevLobby.users, data];

        return { ...prevLobby, users: newUsersList };
      });
    };

    const leaveMessage = (payload) => {
      const data = JSON.parse(payload.body);
      console.log("Leave message received:", data);
    
      const userLeft = data.user;
      const isLobbyOwner = data.isLobbyOwner;
    
      if (isLobbyOwner) {
        if (stompClient) {
          stompClient.disconnect();
        }
        navigate("/home");
        alert("You have left the lobby and the lobby has been closed!");
      } else {
        alert(userLeft.username + " has left the lobby");
        setLobby((prevLobby) => {
          const newUsersList = prevLobby.users.filter(
            (user) => user.id !== userLeft.id
          );
    
          return { ...prevLobby, users: newUsersList };
        });
      }
    };

    if (stompClient) {
      stompClient.connect({}, onConnect, onError);
    }
  }, [stompClient]);

  const kickMessage = (payload) => {
    const data = JSON.parse(payload.body);
    console.log("Kick message received:", data);
    alert(`${data.username} has been kicked out of the lobby`);

    const currentUserToken = localStorage.getItem("userToken");

    if (data.userToken === currentUserToken) {
      navigate("/home");
    } else {
      setLobby((prevLobby) => {
        const newUsersList = prevLobby.users.filter(
          (user) => user.userToken !== data.userToken
        );

        return { ...prevLobby, users: newUsersList };
      });
    }
  };

  useEffect(() => {
    console.log("Successfully fetched lobby details!");
    fetchLobby();
  }, []);

  //START GAME
  //In the 'onMessageReceived' method -> check if host is next person to generate a picture or not
  //See comment of 'onMessageReceived' in 'LobbyJoined.tsx' for reference
  const doStartGame = () => {
    {
      /* //TODO set lobby.gameStarted to true */
    }

    stompClient.send(`/game/lobby/startgame/${id}`, {}, id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData, "formData");
      const userToken = localStorage.getItem("userToken");
      // eslint-disable-next-line
      const config = {
        headers: {
          userToken,
        },
      };

      // Making the PUT request with headers
      const updatedLobby = await api.put(
        `/lobby/update/${id}`,
        formData,
        config
      );
      console.log("Lobby updated:", updatedLobby.data);
      setLobby(updatedLobby.data);
      setEditMode(false);
    } catch (error) {
      console.error(
        `Something went wrong while updating the lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
    }
  };

  const formatBase64Image = (base64) => {
    if (!base64.startsWith("data:image/")) {
      return `data:image/jpeg;base64,${base64}`;
    }

    return base64;
  };

  const kickPlayer = async (playerToken: string) => {
    try {
      const hostToken = localStorage.getItem("userToken");
      const playerTokenJson = JSON.stringify({ userToken: playerToken });
      const hostTokenJson = JSON.stringify({ userToken: hostToken });

      const response = await api.post(
        `/hostRemovePlayer/${id}`,
        playerTokenJson,
        {
          headers: {
            "Content-Type": "application/json",
            userToken: hostTokenJson,
          },
        }
      );
      console.log("Player kicked:", response.data);
      setLobby((prevLobby) => ({
        ...prevLobby,
        users: prevLobby.users.filter((user) => user.userToken !== playerToken),
      }));
    } catch (error) {
      console.error(
        `Something went wrong while kicking the player: \n${handleError(error)}`
      );
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
    }
  };

  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lobby.lobbyInvitationCode).then(
      () => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);

    return date.toLocaleDateString("de-CH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  let content = <Spinner />;

  if (lobby && !editMode) {
    content = (
      <div className="game">
        <ul className="game user-list">
          <li key="lobbyId">
            <div className="player container">
              <div className="player lobbyId">Lobby ID: {lobby.id}</div>
            </div>
          </li>
          <li key="lobbyInvitationCode">
            <div className="player container">
              <div className="player invitation-code-container">
                <div className="player invitation-code">
                  Invitation Code: {lobby.lobbyInvitationCode}
                  <button
                    onClick={copyToClipboard}
                    style={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                      display: "flex",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h480v80H200Z" />
                    </svg>
                  </button>
                </div>
                {copySuccess && <span>{copySuccess}</span>}
              </div>
            </div>
          </li>
          <li key="qrInvitationCode">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img src={imgUrl} alt="QR Code" width={256} />
            </div>
          </li>
          <li key="maxAmtPlayers">
            <div className="player container">
              <div className="player maxAmtPlayers">
                Maximum Players: {lobby.maxAmtUsers}
              </div>
            </div>
          </li>
          <li key="lobbyOwner">
            <div className="player container">
              <div className="player lobbyOwner">
                Game Host: {lobby.lobbyOwner}
              </div>
            </div>
          </li>
          <li key="joinedPlayers">
            <div className="player container">
              <div className="player joinedPlayers">
                Number of Joined Players:{" "}
                {lobby.users && lobby.users.length > 0
                  ? `${lobby.users.length}`
                  : "No players joined yet!"}
              </div>
            </div>
          </li>
          {lobby.users && (
            <li
              style={{
                backgroundColor: "#f0f0f0",
                marginBottom: "10px",
                borderRadius: "5px",
                padding: "10px",
                display: "flex",
                gap: "10px",
                maxWidth: "320px",
                flexWrap: "wrap",
              }}
            >
              {lobby.users.map((player, index) => (
                <div
                  key={`player-${index}`}
                  className="player container tooltip"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "fit-content",
                    margin: "0",
                    zIndex: "1",
                  }}
                >
                  <div
                    className="player-username"
                    style={{ fontWeight: "bold" }}
                  >
                    {player.username}
                  </div>
                  {player.userToken !== localStorage.getItem("userToken") && (
                    <button
                      width="100%"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                      onClick={() => kickPlayer(player.userToken)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                        style={{
                          height: "24px",
                          width: "24px",
                          stroke: "red",
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                  {/* <div className="player-score">Score: {player.score}</div> */}
                  <span className="tooltip-text">
                    {player.picture ? (
                      <img
                        src={formatBase64Image(player.picture)}
                        alt={`${player.username}'s Profile`}
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <div
                        className="player-username"
                        style={{ fontWeight: "bold", marginBottom: "5px" }}
                      >
                        ID: {player.id}
                        <br />
                        Username: {player.username}
                        <br />
                        Birthdate: {player.birthDay}
                        <br />
                        Status: {player.status}
                        <br />
                        Created At: {formatDate(player.createDate)}
                      </div>
                    )}
                  </span>
                </div>
              ))}
            </li>
          )}
        </ul>

        <Button
          width="100%"
          style={{ marginBottom: "10px" }}
          onClick={() => setEditMode(true)}
        >
          Edit Settings
        </Button>
        <Button
          width="100%"
          disabled={!lobby.users || lobby.users.length < 2}
          style={{ marginBottom: "10px" }}
          onClick={() => doStartGame()}
        >
          Start Game
        </Button>
        <Button
          width="100%"
          style={{ marginBottom: "10px" }}
          onClick={() => leaveLobby()}
        >
          Leave and Delete lobby
        </Button>
        <div className="tooltip-container">
          <AiOutlineInfoCircle data-tooltip-id="rulesTooltip" />
          <ReactTooltip id="rulesTooltip" place="right" effect="solid">
            <div>
              <p>
                1) Per round, every user is once the prompt writer that creates
                an image.
              </p>
              <p>2) Every other user has to guess the prompt.</p>
              <p>
                3) The closer you are to the guess, the more points you get.
              </p>
              <p>
                4) The user with the most points at the end of the game wins.
              </p>
            </div>
          </ReactTooltip>
        </div>
      </div>
    );
  }

  if (lobby && editMode) {
    content = (
      <div className="game">
        <form onSubmit={handleSubmit}>
          {/* Assuming id is not editable but shown for reference */}
          <p>Lobby ID: {id}</p>
          <div className="game form-field">
            <label>Amount of Rounds:</label>
            <select
              name="amtOfRounds"
              value={formData.amtOfRounds}
              onChange={handleChange}
            >
              {[1, 2, 3].map((round) => (
                <option key={round} value={round}>
                  {round}
                </option>
              ))}
            </select>
          </div>
          <div className="game form-field">
            <label>Maximum Amount of Users:</label>
            <select
              name="maxAmtUsers"
              value={formData.maxAmtUsers}
              onChange={handleChange}
            >
              {[2, 3, 4, 5].map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          <div className="game form-field">
            <label>Time Limit:</label>
            <select
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
            >
              {[20, 30, 40, 50].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Update Lobby</Button>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
        </form>
      </div>
    );
  }

  return <BaseContainer className="game container">{content}</BaseContainer>;
};

export default LobbyDetailHost;
