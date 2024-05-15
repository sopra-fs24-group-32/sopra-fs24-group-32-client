import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Home = () => {
  const navigate = useNavigate();
  const [currentLobbyActive, setCurrentLobbyActive] = useState<boolean>(false);

  const navigateToCreateLobby = () => {
    navigate("/lobby/create");
  };

  const navigateToJoinLobby = () => {
    navigate("/lobby/join");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userToken = localStorage.getItem("userToken");
        const requestBody = JSON.stringify({ userToken });
        const response = await api.post(
          "/lobby/showLeaveCurrentLobby",
          requestBody
        );
        setCurrentLobbyActive(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching if the user is in a lobby: \n${handleError(
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
    }

    fetchData();
  }, []);

  async function logout() {
    const userToken = localStorage.getItem("userToken");
    const requestBody = JSON.stringify({ userToken });
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    navigate("/login");
    await api.post("/logoutByToken", requestBody);
  }

  const leaveCurrentLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const requestBody = JSON.stringify({ userToken });
      await api.post("/lobby/leaveCurrentLobby", requestBody);
      setCurrentLobbyActive(false);
      alert("You have left your lobby!");
    } catch (error) {
      console.log(
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

  return (
    <BaseContainer className="home container">
      <div className="tooltip-container">
        <AiOutlineInfoCircle data-tooltip-id="rulesTooltip" />
        <ReactTooltip id="rulesTooltip" place="right" effect="solid">
          <div>
            <p>
              1) Per round, every user is once the prompt writer that creates an
              image.
            </p>
            <p>2) Every other user has to guess the prompt.</p>
            <p>3) The closer you are to the guess, the more points you get.</p>
            <p>4) The user with the most points at the end of the game wins.</p>
          </div>
        </ReactTooltip>
      </div>
      <Button
        className="homeButton createButton"
        onClick={navigateToCreateLobby}
      >
        Create Lobby
      </Button>
      <Button className="homeButton joinButton" onClick={navigateToJoinLobby}>
        Join Lobby
      </Button>
      <Button
        className="homeButton logoutButton"
        onClick={() => leaveCurrentLobby()}
        disabled={!currentLobbyActive}
      >
        Leave current lobby
      </Button>
      <Button className="homeButton logoutButton" onClick={() => logout()}>
        Logout
      </Button>
    </BaseContainer>
  );
};

export default Home;
