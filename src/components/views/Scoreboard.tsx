import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getDomain } from "helpers/getDomain";
import PropTypes from "prop-types";
import "styles/views/Scoreboard.scss";

const Player = ({ rank, username, score }) => (
  <div className={`player container rank-${rank}`}>
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
  const location = useLocation();
  const [imageDescription, setImageDescription] = useState("");
  const { id } = useParams();
  const userToken = localStorage.getItem("userToken");
  const [playerGuessed, setPlayerGuessed] = useState("");
  const [timer, setTimer] = useState(15); // Default timer
  const [users, setUsers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [amtOfRounds, setAmtOfRounds] = useState(0);
  const [lobbyOwner, setLobbyOwner] = useState(null);
  const [currentPictureGenerator, setCurrentPictureGenerator] = useState("");
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("username")
  );
  const [stompClient, setStompClient] = useState(null);

  /*
  If the host clicks home the lobby gets deleted
  */
  const doGoHomeHost = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const requestBody = JSON.stringify({ userToken });
      const response = await api.post(`/deleteLobby/${id}`, requestBody);
      navigate("/home");
      alert("You have left your lobby!");
    } catch (error) {
      console.error(
        `Something went wrong while leaving/deleting the lobby: \n${handleError(
          error
        )}`
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

  //If a normal player clicks home he leaves the lobby
  const doGoHome = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const requestBody = JSON.stringify({ userToken });
      const response = await api.post(`/finishedGame/leave/${id}`, requestBody);
      navigate("/home");
      alert("You have left your lobby!");
    } catch (error) {
      console.error(
        `Something went wrong during the leave: \n${handleError(error)}`
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

  //fetch score board values needs to be changed
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/lobby/${id}`); // Assuming this endpoint gives user scores
        console.log(response.data);
        setLobbyOwner(response.data.lobbyOwner);
        setAmtOfRounds(response.data.amtOfRounds);
        setCurrentRound(response.data.currentRound);
        setCurrentPictureGenerator(response.data.currentPictureGenerator);
        const descriptionResponse = await api.get(
          `/game/lastDescription/${id}`
        );
        console.log(descriptionResponse.data);
        setImageDescription(descriptionResponse.data);
        if (response.data.users && Array.isArray(response.data.users)) {
          const userMap = new Map();
          response.data.users.forEach((user) => {
            if (!userMap.has(user.username)) {
              userMap.set(user.username, user);
            }
          });
          // Sort users by score in descending order
          const uniqueUsers = Array.from(userMap.values()).sort(
            (a, b) => b.score - a.score
          );
          setUsers(uniqueUsers);
        }
      } catch (error) {
        console.error(`Failed to fetch users: \n${handleError(error)}`);
        console.error("Details:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "An unknown error occurred";
        alert(`${errorMessage}`);
      }
    }

    async function resetDallEImageURL() {
      api.post("/resetImageURL");
    }

    resetDallEImageURL();
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
      nextRound();
    }

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timer]);

  const nextRound = () => {
    if (currentRound < amtOfRounds) {
      stompClient.send(`/game/continueGame/${id}`, {}, id);
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
        const subscription = stompClient.subscribe(
          `/game/public/${id}`,
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
        navigate(`/game/guess/${id}`, {
          state: { nextPictureGenerator: nextPictureGenerator },
        });
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
      <div className="score">
        <ul className="score user-list">
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
        <div className="score button">
          {currentUser === lobbyOwner ? (
            currentRound >= amtOfRounds || users.length < 2 ? (
              <Button className="nextButton" onClick={() => doGoHomeHost()}>
                Home
              </Button>
            ) : (
              <>
                <h3>Waiting for next round to start..</h3>
              </>
            )
          ) : currentRound >= amtOfRounds || users.length < 2 ? (
            <Button className="nextButton" onClick={() => doGoHome()}>
              Home
            </Button>
          ) : (
            <>
              <h3>Waiting for next turn to start..</h3>
            </>
          )}
        </div>
        <h3>Original Image Description: {imageDescription}</h3>
        <h3>Round Summary</h3>
        <table className="score-table-summary">
          <thead>
            <tr>
              <th>Player</th>
              <th>Player Guess</th>
              <th>ChatGPT Similarity</th>
              <th>Point Obtained</th>
              <th>Bonus</th>
              <th>Points + Bonus</th>
              <th>Time Guess Submitted</th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user, index) =>
                currentPictureGenerator !== user.username && (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.playerGuess || "No submission"}</td>
                    <td>{user.similarityScore}</td>
                    <td>{user.pointsAwardedFromChatGPT}</td>
                    <td>{user.bonusPoints}</td>
                    <td>{user.totalPoints}</td>
                    <td>{user.timeGuessSubmitted}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <BaseContainer className="score container">
      {currentRound >= amtOfRounds ? (
        <h2>Final Scoreboard</h2>
      ) : (
        <h2>Scoreboard</h2>
      )}
      {content}
      <div className="timer">
        {currentRound >= amtOfRounds ? (
          <></>
        ) : (
          <div>
            <h3>{timer} seconds remaining for next turn</h3>
          </div>
        )}
        <h3>
        Rounds played: {currentRound === 0 ? `1/${amtOfRounds}` : `${currentRound}/${amtOfRounds}`}
        </h3>
      </div>
    </BaseContainer>
  );
};

export default Scoreboard;
