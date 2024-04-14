import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

import SockJS from "sockjs-client/dist/sockjs";
import {over} from 'stompjs';

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

  const [lobby, setLobby] = useState<User>(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {


    async function connectAndSubscribeUserToSocket(){
      const sock = new SockJS("http://localhost:8080/ws");
      const client = over(sock);
      setStompClient(client);
    }

    async function fetchData() {
      try {
        const response = await api.get(`/lobby/${id}`);

        setLobby(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the lobby: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the lobby! See the console for details."
        );
      }
    }

    fetchData();
    connectAndSubscribeUserToSocket();
  }, []);

  useEffect(() => {

    const onConnect = () => {
      console.log("CONNECTING...");
      if(stompClient){
        console.log("Connected to WebSocket");
        const subscription = stompClient.subscribe("/game/public", onMessageReceived);
        const username = localStorage.getItem("username");
        const message = {
          username: username,
        };
        stompClient.send("/game/lobby/join", {}, JSON.stringify(message));
      }
    }

    const onError = (error) => {
      console.log("Error:", error);
    }

    const onMessageReceived = (payload) => {
      console.log("MESSAGE RECEIVED: ");
      
      const body = JSON.parse(payload.body);
      const decodedPayload = atob(body.payload);


      console.log("Received message:", decodedPayload);
    }
    if(stompClient){
      stompClient.connect({}, onConnect, onError);
    }
}, [stompClient]);

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
                Max Players: {lobby.maxAmtPlayers}
              </div>
            </div>
          </li>
          <li key="lobbyOwner">
            <div className="player container">
              <div className="player lobbyOwner">Owner: {lobby.lobbyOwner}</div>
            </div>
          </li>
          {lobby.allPlayers &&
            lobby.allPlayers.map((player, index) => (
              <li
                key={`player-${index}`}
                style={{
                  backgroundColor: "#f0f0f0",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <div
                  className="player container"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div className="player-info">
                    <span
                      className="player-username"
                      style={{ fontWeight: "bold", marginRight: "15px" }}
                    >
                      Username: {player.username}
                    </span>
                    <span className="player-points" style={{ color: "#555" }}>
                      Points: {player.points}
                    </span>
                  </div>
                </div>
              </li>
            ))}
        </ul>

        <Button
          width="100%"
          style={{ marginBottom: "10px" }}
          onClick={() => navigate("/game")}
        >
          Back
        </Button>
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

export default LobbyDetailJoined;
