import React, { useState, useEffect } from "react";
import Lobby from "models/Lobby";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const LobbyCreate = () => {
  const navigate = useNavigate();
  // const [lobbyId, setLobbyId] = useState<string>(null);

  const createLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const requestBody = JSON.stringify({ userToken });
      const response = await api.post("/lobby/create", requestBody);

      const lobby = new Lobby(response.data);

      navigate(`/lobby/host/${lobby.id}`);
    } catch (error) {
      alert(
        `Something went wrong during the register: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer className="home container">
      <Button className="createLobbyButton" onClick={createLobby}>
        Create Lobby
      </Button>
    </BaseContainer>
  );
};

export default LobbyCreate;
