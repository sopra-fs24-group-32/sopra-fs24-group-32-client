import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
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

  //fetch score board values needs to be changed
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/lobby/${id}`); // Assuming this endpoint gives user scores
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

  // function need to be changed
  const continueGame = async () => {
    try {
      const timeGuessSubmitted = 10.0; // to be replaced with the actual time the guess was submitted
      const requestBody = JSON.stringify({ playerGuessed, timeGuessSubmitted });
      const userTokenJson = JSON.stringify({ userToken });
      const response = await api.put(`/game/chatgpt/${id}`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          userToken: userTokenJson,
        },
      }); //commented out since api not available atm
      navigate("/results");
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  };

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
        <Button width="100%" onClick={continueGame}>
          Continue Game
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Scoreboard</h2>
      {content}
    </BaseContainer>
  );
};

export default Scoreboard;
