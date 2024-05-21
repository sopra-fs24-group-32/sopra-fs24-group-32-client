import React from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Home = () => {
  const navigate = useNavigate();


  const navigateToCreateLobby = () => {
    navigate("/lobby/create");
  };

  const navigateToJoinLobby = () => {
    navigate("/lobby/join");
  };

  async function logout() {
    const userToken = localStorage.getItem("userToken");
    const requestBody = JSON.stringify({ userToken });
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    navigate("/login");
    await api.post("/logoutByToken", requestBody);
  }

  return (
    <BaseContainer className="home container">
      <Button
        className="homeButton createButton"
        onClick={navigateToCreateLobby}
      >
        Create Lobby
      </Button>
      <Button className="homeButton joinButton" onClick={navigateToJoinLobby}>
        Join Lobby
      </Button>
      <Button className="homeButton logoutButton" onClick={() => logout()}>
        Logout
      </Button>
      <div className="info">
        <h3>Information</h3>
        <p>
          Dive into the world of GPTuessr, where creativity and AI collide to create an unparalleled gaming experience. Inspired by classics like skribbl.io, GPTuessr transcends traditional boundaries by integrating DALL-E, an advanced AI capable of generating vivid images from textual descriptions provided by players.
        </p>
        <p>
          Each round, players take turns to invent descriptions which are then brought to life through stunning AI-generated artwork. Your challenge is to guess what your friends have described to generate the images, pushing the limits of your imagination and deductive reasoning.
        </p>
        <h4>How It Works</h4>
        <p>
          You earn points based on how closely your guess match the original description. For fairness reason, ChatGPT is used to compute the similarity score. The scoring is precise:
          <ul>
            <li><strong>Similarity score (0.75 - 1.0):</strong> You obtain <strong>6 points</strong>.</li>
            <li><strong>Similarity score (0.50 - 0.74):</strong> You obtain <strong>4 points</strong>.</li>
            <li><strong>Similarity score (0.25 - 047):</strong> You obtain <strong>2 points</strong> .</li>
            <li><strong>Similarity score bellow 0.25:</strong> You obtain <strong>0 points</strong>.</li>
          </ul>
        </p>
        <p>
          <strong>Time</strong> is also of the essence! Bonus points are awarded based on how quickly you submit your guess:
          <ul>
            <li><strong>Guess submitted with 25% of the time limit:</strong> +25% of your similarity score as bonus points.</li>
            <li><strong>Guess submitted between 25% and 50% of the time limit:</strong> +10% of your similarity score as bonus points.</li>
            <li><strong>Otherwise:</strong> you obtain 0 bonus points.</li>
            <p><strong>Final point = Points_from_ChatGPT_Score + Bonus_Percentage*Points_from_ChatGPT_Score</strong></p>
          </ul>
        </p>
        <p>
          <strong>Hint:</strong> The more accurate your description, the higher your score. Be as detailed as possible, but do not give away the answer too easily!
        </p>
        <p>
          The player with the highest score at the end of the game is declared the winner!
        </p>
        <p>
          Embrace the synergy of art and technology at GPTuessr and enjoy a gaming experience like no other. Whether you are here to compete or just to have fun, every game round promises a new adventure in creativity and fun!
        </p>
      </div>

    </BaseContainer>
  );
};

export default Home;