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
import Stomp from "stompjs";
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

const LobbyDetailHost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lobby, setLobby] = useState(new Lobby());


  const fetchLobby = async () => {

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
  };


  useEffect(() => {
    console.log("Successfully fetched lobby details!");
    fetchLobby();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchLobby, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {

    const Socket = new SockJS(getDomain() + "/websocket");
    const stompClient = Stomp.over(Socket);
    let subscription;

    stompClient.connect(
      {}, (frame) => {
        subscription = stompClient.subscribe(`/topic/lobby/${id}`,
          async (message) => {
          // const messageBody = JSON.parse(message.body);
            fetchLobby();
          }
        );
      }); 

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      stompClient.disconnect();
    };
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
          <li key="lobbyInvitationCode">
            <div className="player container">
              <div className="player invitationCode">Invitation Code: {lobby.lobbyInvitationCode}</div>
            </div>
          </li>
          <li key="maxAmtPlayers">
            <div className="player container">
              <div className="player maxAmtPlayers">Maximum Players: {lobby.maxAmtUsers}
              </div>
            </div>
          </li>
          <li key="lobbyOwner">
            <div className="player container">
              <div className="player lobbyOwner">Game Host: {lobby.lobbyOwner}</div>
            </div>
          </li>
          <li key="joinedPlayers">
            <div className="player container">
              <div className="player joinedPlayers">
                  Number of Joined Players: {lobby.users && lobby.users.length > 0 ? `${lobby.users.length}` : "No players joined yet!"}
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
                      {player.username}
                    </span>
                    <span className="player-points" style={{ color: "#555" }}>
                      Score: {player.score}
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

        <Button
          width="100%"
          disabled={!lobby.users || lobby.users.length < 2}
          style={{ marginBottom: "10px" }}
          // add onClick event to navigate to the game page 
          // and then set lobby.gameStarted to true
          // onClick={() => navigate(`/lobby/start/${id}`)}
          onClick={() => navigate("/game")}

        >
          Start Game
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

export default LobbyDetailHost;
