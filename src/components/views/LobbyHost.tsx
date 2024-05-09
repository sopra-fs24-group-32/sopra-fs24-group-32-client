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
      alert(
        `${errorMessage}`
      );
      navigate("/home");
    }
  };

  const connectAndSubscribeUserToSocket = async () => {
    const sock = new SockJS(getDomain() + "/ws");
    const client = over(sock, { websocket: { withCredentials: false } });
    setStompClient(client);
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
      console.log("Join message received:", data);
      alert(data.username + " has left the lobby");

      // Update the state to include the new user
      setLobby((prevLobby) => {
        const newUsersList = prevLobby.users.filter(
          (user) => user.id !== data.id
        );

        return { ...prevLobby, users: newUsersList };
      });
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
      [name]: value,
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
      alert(
        `${errorMessage}`
      );
    }
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
      alert(
        `${errorMessage}`
      );
    }
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
              <div className="player invitationCode">
                Invitation Code: {lobby.lobbyInvitationCode}
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
          {lobby.users &&
            lobby.users.map((player, index) => (
              <li
                key={`player-${index}`}
                style={{
                  backgroundColor: "#f0f0f0",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <div
                  className="player container tooltip"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="player-username"
                    style={{ fontWeight: "bold", marginBottom: "5px" }}
                  >
                    {player.username}
                  </div>
                  {player.userToken !== localStorage.getItem("userToken") && (
                    <Button
                      width="100%"
                      style={{
                        marginBottom: "10px",
                        backgroundColor: "#ff6666",
                      }}
                      onClick={() => kickPlayer(player.userToken)}
                    >
                      Kick Out
                    </Button>
                  )}
                  {/* <div className="player-score">Score: {player.score}</div> */}
                  <span className="tooltip-text">
                    ID: {player.id}
                    <br />
                    Username: {player.username}
                    <br />
                    Birthdate: {player.birthDay}
                    <br />
                    Status: {player.status}
                    <br />
                    Created At: {player.createDate}
                  </span>
                </div>
              </li>
            ))}
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
      </div>
    );
  }

  if (lobby && editMode) {
    content = (
      <div className="game">
        <form onSubmit={handleSubmit}>
          {/* Assuming id is not editable but shown for reference */}
          <p>Lobby ID: {id}</p>
          <label>
            Amount of Rounds:
            <input
              type="number"
              name="amtOfRounds"
              value={formData.amtOfRounds}
              onChange={handleChange}
            />
          </label>
          <label>
            Maxiumum Amount of Users:
            <input
              type="number"
              name="maxAmtUsers"
              value={formData.maxAmtUsers}
              onChange={handleChange}
            />
          </label>
          <label>
            Time Limit:
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
            />
          </label>
          <Button type="submit">Update Lobby</Button>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
        </form>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">Get user from secure endpoint:</p>
      {content}
    </BaseContainer>
  );
};

export default LobbyDetailHost;
