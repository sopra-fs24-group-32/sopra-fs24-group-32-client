import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import { useWebSocket } from "../../helpers/WebSocketContext";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";

const GameCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageDescription, setImageDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [timer, setTimer] = useState(30); // Default timer
  const [allGuessesSubmitted, setAllGuessesSubmitted] = useState(false);
  const { stompClient } = useWebSocket();

  const sendDalle = async () => {
    setIsSubmitting(true);
    try {
      const requestBody = JSON.stringify({ description: imageDescription });
      const response = await api.post(`/game/image/${id}`, requestBody);
      setGeneratedImage(response.data);

      await fetchGameSettings(); // Fetch or set the timer immediately after image is set
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
      //setIsSubmitting(false);
    }
  };

  // Fetch timer settings and initialize the game timer
  const fetchGameSettings = async () => {
    try {
      const gameSettings = await api.get(`/lobby/${id}`);
      setTimer(gameSettings.data.timerDuration || 30);
    } catch (error) {
      console.error("Failed to fetch lobby details:", handleError(error));
      setTimer(30);
    }
  };

  // Start the timer once the image is generated
  useEffect(() => {
    if (generatedImage) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          clearInterval(interval);

          return 0;
        });
      }, 1000);
      //checkAllGuessesSubmitted();         //not implemented yet in the backend and therefore doesnt work

      return () => clearInterval(interval);
    }
  }, [generatedImage]);

  useEffect(() => {
    if (timer === 0 || allGuessesSubmitted === true) {
      alert("time is up or all players guessed!");
      //navigate(`/results`);
    }
  }, [timer, allGuessesSubmitted, navigate]);

  // Check if all guesses have been submitted
  const checkAllGuessesSubmitted = async () => {
    try {
      const response = await api.get(`/game/guess/${id}`); //not implemented yet in the backend check if all players guessed so creator can navigate further to the results
      setAllGuessesSubmitted(response.data.allSubmitted);
    } catch (error) {
      console.error(
        `Failed to check if all guesses were submitted: ${handleError(error)}`
      );
    }
  };

  /*
  useEffect(() => {
    const Socket = new SockJS(getDomain() + "/websocket");
    const stompClient = Stomp.over(Socket);
    let subscription;

    stompClient.connect({}, (frame) => {
      subscription = stompClient.subscribe(
        `/topic/lobby/${id}`,
        async (message) => {
          fetchGameSettings();
        }
      );
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      stompClient.disconnect();
    };
  }, []);

  */

  return (
    <BaseContainer>
      <div className="join container">
        {isSubmitting ? (
          <div className="join form">
            {generatedImage ? (
              <>
                <h2>Your created Image:</h2>
                <img src={generatedImage} width="70%" alt="Generated" />
                <p>Waiting for all players to submit their guesses...</p>
                <p>Time remaining: {timer} seconds</p>
              </>
            ) : (
              <>
                <h2>Your image is being created...</h2>
                <p>Loading image...</p>
              </>
            )}
            <h3>Description: {imageDescription}</h3>
          </div>
        ) : (
          <div className="join form">
            <h3>It is your turn to draw an image!</h3>
            <div className="register field">
              <label className="register label">
                Type in a text description of what you want DALL-E to draw
              </label>
              <input
                type="text"
                className="register input"
                placeholder="enter here.."
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
              />
            </div>
            <div className="register button-container">
              <Button
                disabled={!imageDescription}
                width="100%"
                onClick={sendDalle}
              >
                Send to DALL-E
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseContainer>
  );
};

export default GameCreate;
