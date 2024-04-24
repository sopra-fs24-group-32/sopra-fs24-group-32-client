import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getDomain } from "helpers/getDomain";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import "styles/views/Scoreboard.scss";

const Player = ({ rank, username, score }) => (
  <div className="player container">
    <div className="player rank">{rank}.</div>
    <div className="player username">{username}</div>
    <div className="player score">Points: {score}</div>
  </div>
);

Player.propTypes = {
  rank: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

const Scoreboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userToken = localStorage.getItem("userToken");
  const [playerGuessed, setPlayerGuessed] = useState("");
  const [timer, setTimer] = useState(10); // Default timer
  const [users, setUsers] = useState([]);
  const [lobbyOwner, setLobbyOwner] = useState("");
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("username")
  );
  const [stompClient, setStompClient] = useState(null);

  //fetch score board values needs to be changed
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/lobby/${id}`); // Assuming this endpoint gives user scores
        setLobbyOwner(response.data.lobbyOwner);
        if (response.data.users && Array.isArray(response.data.users)) {
          // Sort users by score in descending order
          const sortedUsers = response.data.users.sort(
            (a, b) => b.score - a.score
          );
          setUsers(sortedUsers);
        }
      } catch (error) {
        console.error(`Failed to fetch users: \n${handleError(error)}`);
        alert("Failed to load users. Please check the console for details.");
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      // When the timer reaches 0, clear the interval and call continueGame
      clearInterval(interval);
      //continueGame();
    }

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timer]);

  const nextRound = () => {
    stompClient.send("/game/continueGame", {}, id);
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
        const subscription = stompClient.subscribe(
          "/game/public",
          onMessageReceived
        );
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
        console.log("YOUR TURN TO GENERATE A PICTURE");
        stompClient.disconnect();
        navigate(`/game/create/${id}`);
      } else {
        console.log("YOUR TURN TO GUESS THE INPUT");
        stompClient.disconnect();
        navigate(`/game/guess/${id}`);
      }
    };
    if (stompClient) {
      stompClient.connect({}, onConnect, onError);
    }
  }, [stompClient]);

  //WEBSOCKET SUBSCRIPTION

  let content = <Spinner />;

  if (users.length > 0) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user, index) => (
            <li key={user.id}>
              <Player
                rank={index + 1}
                username={user.username}
                score={user.score}
              />
            </li>
          ))}
        </ul>
        {currentUser === lobbyOwner ? (
          <>
            <Button width="100%" onClick={nextRound}>
              Next Round
            </Button>
          </>
        ) : (
          <>
            <h3>Waiting for next round to start..</h3>
          </>
        )}
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Scoreboard</h2>
      {content}
      <div className="timer">{timer} seconds remaining</div>
    </BaseContainer>
  );
};

export default Scoreboard;
