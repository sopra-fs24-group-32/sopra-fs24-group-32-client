import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const Home = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
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
          `/lobby/showLeaveCurrentLobby`,
          requestBody
        );
        setCurrentLobbyActive(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the user: \n${handleError(
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
    // eslint-disable-next-line
    await api.post(`/logoutByToken`, requestBody);
  }

  const leaveCurrentLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const requestBody = JSON.stringify({ userToken });
      const response = await api.post("/lobby/leaveCurrentLobby", requestBody);
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
