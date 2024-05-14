import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { ClockLoader } from "react-spinners";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";
import Lobby from "models/Lobby";

import SockJS from "sockjs-client";
//import Stomp from "stompjs";
import { useWebSocket } from "../../helpers/WebSocketContext";
import { over } from "stompjs";
import { getDomain } from "helpers/getDomain";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player name">{user.name}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const LobbyDetailJoined = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [lobby, setLobby] = useState(new Lobby());
  const [stompClient, setStompClient] = useState(null);
  const { getStompClient } = useWebSocket();
  const username = localStorage.getItem("username");

  const fetchData = async () => {
    try {
      const response = await api.get(`/lobby/${id}`);

      setLobby(response.data);
      const listOfRemovedPlayers = response.data.listOfRemovedPlayers;
      if (listOfRemovedPlayers.includes(username)) {
        // alert("You have been removed from the lobby");
        navigate("/home");
      }
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
    }
  };

  const leaveLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      await api.post(`/lobby/leave/${id}`, { userToken });
      if (stompClient) {
        stompClient.disconnect();
      }
      navigate("/home");
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
      alert(`${errorMessage}`);
    }
  };

  //WEBSOCKET SUBSCRIPTION
  useEffect(() => {
    const connectAndSubscribeUserToSocket = async () => {
      const sock = new SockJS(getDomain() + "/ws");
      const client = over(sock, { websocket: { withCredentials: false } });
      setStompClient(client);
    };
    connectAndSubscribeUserToSocket();
  }, [getStompClient]);

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
      console.log("Error:", error);
    };
    /*
    Here we wait for the host to start the game
    As soon as the host started the game we receive the user that will generate the next picture
    If this user corresponds to this client -> navigate to picture generation page, else to guessing page
    */
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
      if (stompClient) {
        stompClient.disconnect();
      }
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

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);

    return date.toLocaleDateString("de-CH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  useEffect(() => {
    console.log("Successfully fetched lobby details!");
    fetchData();
  }, []);

  const formatBase64Image = (base64) => {
    if (!base64.startsWith("data:image/")) {
      return `data:image/jpeg;base64,${base64}`;
    }

    return base64;
  };

  //  useEffect(() => {
  //    const interval = setInterval(fetchData, 1000);
  //
  //    return () => clearInterval(interval);
  //  }, []);

  let content = <Spinner />;

  if (lobby) {
    content = (
      <div className="game">
        <ul className="game user-list">
          <li key="lobbyId">
            <div className="player container">
              <div className="player lobbyId">Lobby ID: {lobby.id}</div>
            </div>
          </li>
          <li key="maxAmtPlayers">
            <div className="player container">
              <div className="player maxAmtPlayers">
                Max Players: {lobby.maxAmtUsers}
              </div>
            </div>
          </li>
          <li key="maxAmtPlayers">
            <div className="player container">
              <div className="player timeLimit">
                Guess Time Limit: {lobby.timeLimit} sec
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
              </li>
            ))}
        </ul>

        <Button
          width="100%"
          style={{ marginBottom: "10px" }}
          onClick={() => leaveLobby()}
        >
          Leave lobby
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <ClockLoader
        color="#36d7b7"
        size={75}
        speedMultiplier={
          lobby.users && lobby.users.length > 0 ? lobby.users.length : 1
        }
      />
      {content}
    </BaseContainer>
  );
};

export default LobbyDetailJoined;

//export {stompClient as stompClientUser}
