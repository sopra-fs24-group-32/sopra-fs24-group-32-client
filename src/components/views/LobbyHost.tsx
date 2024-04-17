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

const LobbyDetailHost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lobby, setLobby] = useState(new Lobby());
  const [stompClient, setStompClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    maxAmtUsers: 50,
    amtOfRounds: 0,
    timeLimit: 60,
  });

  
  const fetchLobby = async () => {
    try {
      const response = await api.get(`/lobby/${id}`);
      setLobby(response.data);

      setFormData({
        maxAmtUsers: response.data.maxAmtUsers || 50,
        amtOfRounds: response.data.amtOfRounds || 5,
        timeLimit: response.data.timeLimit || 60,
      });
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

  //WEBSOCKET SUBSCRIPTION
  const connectAndSubscribeUserToSocket = async () => {
    const sock = new SockJS(getDomain() + "/ws");
    const client = over(sock);
    setStompClient(client, { websocket: { withCredentials: false } });
  };

  useEffect(() => {
    const onConnect = () => {
      if (stompClient) {
        const subscription = stompClient.subscribe(
          "/game/public",
          onMessageReceived
        );
        /*
        const username = localStorage.getItem("username");
        const message = {
          username: username,
        };

        stompClient.send("/game/lobby/join", {}, JSON.stringify(message));
        */
      }
    };

    const onError = (error) => {
      console.log("Error:", error);
    };

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
    if (stompClient) {
      stompClient.connect({}, onConnect, onError);
    }
  }, [stompClient]);

  useEffect(() => {
    console.log("Successfully fetched lobby details!");
    fetchLobby();
    connectAndSubscribeUserToSocket();
  }, []);

  //START GAME
  //In the 'onMessageReceived' method -> check if host is next person to generate a picture or not
  //See comment of 'onMessageReceived' in 'LobbyJoined.tsx' for reference
  const doStartGame = () => {
    {
      /* //TODO set lobby.gameStarted to true */
    }

    stompClient.send("/game/lobby/startgame", {}, id);
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
      const userTokenString = JSON.stringify({ userToken });
      // eslint-disable-next-line
      const config = {
        headers: {
          "userToken": userTokenString,
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
      alert(
        "Something went wrong while updating the lobby! See the console for details."
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
