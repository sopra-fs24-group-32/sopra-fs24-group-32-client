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
    navigate("/");
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
      <div
        className="tooltip-container"
        style={{ fontWeight: "bold", marginBottom: "5px" }}
      >
        <AiOutlineInfoCircle data-tooltip-id="rulesTooltip" />
        <ReactTooltip
          id="rulesTooltip"
          place="bottom"
          effect="solid"
          className="custom-tooltip"
        >
          <div>
            <h4>Rules</h4>
            <p>
              1) Per round, every player is once the prompt writer that creates
              an image.
            </p>
            <p>2) Every other player has to guess the prompt.</p>
            <p>
              3) The player with the most points at the end of the game wins.
            </p>
            <h4>Points attribution</h4>
            <p>The closer you are to the guess, the more points you get.</p>
            <ul>
              <li>
                <strong>Similarity score (0.75 - 1.0):</strong> You obtain{" "}
                <strong>6 points</strong>.
              </li>
              <li>
                <strong>Similarity score (0.50 - 0.74):</strong> You obtain{" "}
                <strong>4 points</strong>.
              </li>
              <li>
                <strong>Similarity score (0.25 - 0.49):</strong> You obtain{" "}
                <strong>2 points</strong> .
              </li>
              <li>
                <strong>Similarity score bellow 0.25:</strong> You obtain{" "}
                <strong>0 points</strong>.
              </li>
            </ul>
            <p>
              <strong>Time</strong> is also of the essence! Bonus points are
              awarded based on how quickly you submit your guess:
              <ul>
                <li>
                  <strong>Guess submitted within 25% of the time limit:</strong>{" "}
                  +25% of your similarity score as bonus points.
                </li>
                <li>
                  <strong>
                    Guess submitted between 26% and 50% of the time limit:
                  </strong>{" "}
                  +10% of your similarity score as bonus points.
                </li>
                <li>
                  <strong>Otherwise:</strong> you obtain 0 bonus points.
                </li>
                <p>
                  <strong>
                    Final point = Points_from_ChatGPT_Score + Bonus_Percentage *
                    Points_from_ChatGPT_Score
                  </strong>
                </p>
              </ul>
            </p>
          </div>
        </ReactTooltip>
      </div>
    </BaseContainer>
  );
};

export default Home;
