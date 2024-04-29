import React, { useState, useCallback, useRef, Component } from "react";
import { api, handleError } from "helpers/api";
import Lobby from "models/Lobby";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
// import {QrReader} from "react-qr-reader";
import QrReader from "react-qr-scanner";


const FormField = React.memo((props) => {
  return (
    <div className="join field">
      <label className="join label">{props.label}</label>
      <input
        type={props.type || "text"}
        className="register input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
});

FormField.displayName = "FormField";

const LobbyJoin = () => {
  const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState<string>(null);
  const [showScanner, setShowScanner] = useState(false);
  const qrReaderRef = useRef(null);

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
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      alert(
        `Something went wrong while joining the lobby. Reason: ${errorMessage}`
      );
    }
  };

  FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
  };

  const handleInvitationCodeChange = useCallback((value: string) => {
    setInvitationCode(value);
  }, []);

  const handleScan = data => {
    if (data) {
      setInvitationCode(data);
      setShowScanner(false);
      joinLobby();
    }
  };

  const handleError = err => {
    console.error(err);
    alert("Failed to join the lobby: " + err.message);
  };

  const toggleScanner = () => {
    if (showScanner && qrReaderRef.current) {
      // Stop the camera stream
      const stream = qrReaderRef.current.getVideoElement().srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop());
    }
    setShowScanner(!showScanner);
  };


  return (
    <BaseContainer>
      <div className="join container">
        <div className="join form">
          <FormField
            label="Enter the Game Code"
            value={invitationCode}
            onChange={handleInvitationCodeChange}
          />
          <Button
            disabled={!invitationCode}
            width="100%"
            onClick={joinLobby}
          >
            Join Game
          </Button>
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>or</div> {/* OR separator */}
          <Button
            width="100%"
            onClick={toggleScanner}
          >
            {showScanner ? "Hide Scanner" : "Scan QR Code"}
          </Button>
        </div>
        {showScanner && (
          <div className="qr-scanner">
            <QrReader
              delay={300}
              ref={qrReaderRef}
              size={128}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%", maxWidth: "300px" }}
            />
            <p>Scan QR Code to join the game</p>
          </div>
        )}
      </div>
    </BaseContainer>
  );
};

export default LobbyJoin;
