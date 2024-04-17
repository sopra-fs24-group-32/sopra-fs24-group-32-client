import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import Lobby from "models/Lobby";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const LobbyJoin = () => {
  const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState<string>(null);

  const joinLobby = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const requestBody = JSON.stringify({ userToken });
      const response = await api.post(
        `/lobby/join/${invitationCode}`,
        requestBody
      );

      const lobby = new Lobby(response.data);
      navigate(`/lobby/joined/${lobby.id}`);
    } catch (error) {
      console.error(
        `Something went wrong while joining the lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      alert(`Something went wrong while joining the lobby. Reason: ${errorMessage}`);
    }
  };

  const FormField = (props) => {
    return (
      <div className="register field">
        <label className="register label">{props.label}</label>
        <input
          type={props?.type || "text"}
          className="register input"
          placeholder="enter here.."
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    );
  };

  FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
  };

  return (
    <BaseContainer>
      <div className="join container">
        <div className="join form">
          <FormField
            label="Invitation Code"
            value={invitationCode}
            onChange={(un: string) => setInvitationCode(un)}
          />
          <div className="register button-container">
            <Button
              disabled={!invitationCode}
              width="100%"
              onClick={() => joinLobby()}
            >
              Join Game
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default LobbyJoin;
