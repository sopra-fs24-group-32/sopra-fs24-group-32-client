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
import QRCode from "qrcode.react";

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
  useEffect(() => {
    const connectAndSubscribeUserToSocket = async () => {
      const sock = new SockJS(getDomain() + "/ws");
      const client = over(sock, { websocket: { withCredentials: false } });
      setStompClient(client);
    };
    connectAndSubscribeUserToSocket();
  }, []);

  useEffect(() => {
    const onConnect = () => {
      if (stompClient) {
        // Subscribe to public messages
        const subPublic = stompClient.subscribe("/game/public", onMessageReceived);

        // Subscribe to join messages
        const subJoin = stompClient.subscribe("/game/join", joinMessage);

        //const subLeave = client.subscribe("/game/leave", onMessageReceived3);        
        const subLeave = stompClient.subscribe("/game/leave", leaveMessage);

        // Send the user token to server to register this client
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
          stompClient.send("/game/lobby/join", {}, userToken);
        }
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
        stompClient.disconnect();
        navigate(`/game/create/${id}`);
      } else {
        stompClient.disconnect();
        navigate(`/game/guess/${id}`);
      }
    };

    const joinMessage = (payload) => {
      const data = JSON.parse(payload.body);
      console.log("Join message received:", data);

      // Update the state to include the new user
      setLobby(prevLobby => {

        // Check if the user is already in the list
        if (prevLobby.users.some(user => user.id === data.id)) {
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

      // Update the state to include the new user
      setLobby(prevLobby => {
        const newUsersList = prevLobby.users.filter(user => user.id !== data.id);
        
        return { ...prevLobby, users: newUsersList };
      });
    };
    if (stompClient) {
      stompClient.connect({}, onConnect, onError);
    }
  }, [stompClient]);

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

    stompClient.send("/game/lobby/startgame", {}, id);
  };

  // const qrCode = () => {
  //   const 
  //   return (
      
  //   );
  // }

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
          <li key="qrInvitationCode">
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <QRCode
                value={lobby.lobbyInvitationCode}
                size={128}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                style={{ margin: "10px" }}
                renderAs={"svg"}
              />
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
          {lobby.users && lobby.users.map((player, index) => (
            <li
              key={`player-${index}`}
              style={{
                backgroundColor: "#f0f0f0",
                marginBottom: "10px",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              <div className="player container tooltip"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="player-username" style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {player.username}
                </div>
                <div className="player-score">Score: {player.score}</div>
                <span className="tooltip-text">
                  ID: {player.id}<br />
                  Username: {player.username}<br />
                  Birthdate: {player.birthdate}<br />
                  Status: {player.status}<br />
                  Created At: {player.createdAt}
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