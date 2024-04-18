import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
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
  const { getStompClient } = useWebSocket();
  const [stompClient, setStompClient] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get(`/lobby/${id}`);

      setLobby(response.data);
    } catch (error) {
      console.error(
        `Something went wrong while fetching the lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the lobby! See the console for details."
      );
    }
  };

  const leaveLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      await api.post(`/lobby/leave/${id}`, { userToken });
      navigate("/home");
    } catch (error) {
      alert(`Failed to leave the lobby: ${error.message}`);
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
        const subscription = stompClient.subscribe(
          "/game/public",
          onMessageReceived
        );

        //HERE THE SUBSCRIPTION FOR /GAME/LOBBY/JOIN HAPPENS
        /*
        You could for example the user token instead of hello
        The logic that follows when all the users receive the message from the server happens in 'onMessageReceived2'
        */
        const subscription2 = stompClient.subscribe(
          "/game/join",
          onMessageReceived2
        );
        stompClient.send("/game/lobby/join", {}, "Hello");
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
        console.log("YOU ARE PICTURE GENERATOR");
        navigate(`/game/create/${id}`);
      } else {
        console.log("YOU ARE INPUT GUESSER");
        navigate(`/game/guess/${id}`);
      }
    };

    const onMessageReceived2 = (payload) => {
      //HERE YOU RECEIVE THE USER THAT JOINED
      /*
      You could for example send the user as a userGetDTO and append it to the page
      */
      console.log("USER JOINED");
    };

    if (stompClient) {
      stompClient.connect({}, onConnect, onError);
    }
  }, [stompClient]);

  useEffect(() => {
    console.log("Successfully fetched lobby details!");
    fetchData();
  }, []);

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
                  className="player container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="player-username"
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginBottom: "5px",
                    }}
                    onClick={() => navigate(`/game/${player.id}`)} // Navigate to user profile
                  >
                    {player.username}
                  </div>
                  <div className="player-score">Score: {player.score}</div>
                </div>
              </li>
            ))}
        </ul>

        <Button
          width="100%"
          style={{ marginTop: "20px", marginBottom: "20px" }}
          onClick={leaveLobby}
        >
          Leave Lobby
        </Button>

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
      <h2>Happy Coding!</h2>
      <p className="game paragraph">Waiting for the Host to start the game</p>
      {content}
    </BaseContainer>
  );
};

export default LobbyDetailJoined;
