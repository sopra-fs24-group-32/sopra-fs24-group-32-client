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
    </BaseContainer>
  );
};

export default Home;
