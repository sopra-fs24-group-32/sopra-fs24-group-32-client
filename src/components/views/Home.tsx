import React, { useState } from "react";
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

  const navigateToCreateLobby = () => {
    navigate("/lobby/create");
  };

  const navigateToJoinLobby = () => {
    navigate("/lobby/join");
  };

  async function logout() {
    const userToken = localStorage.getItem("userToken");
    const requestBody = JSON.stringify({ userToken });
    // eslint-disable-next-line
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    navigate("/login");
    await api.post(`/logoutByToken`, requestBody);
  }

  const leaveCurrentLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const requestBody = JSON.stringify({ userToken });
      const response = await api.post("/lobby/leaveCurrentLobby", requestBody);
      alert("You have left your lobby!");
    } catch (error) {
      alert(`Something went wrong during the leave: \n${handleError(error)}`);
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
