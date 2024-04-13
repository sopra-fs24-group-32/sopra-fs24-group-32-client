import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";

const GameGuess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageDescriptionGuess, setImageDescriptionGuess] = useState("");
  const [timer, setTimer] = useState(30); // Default timer
  const [image, setImage] = useState("");
  const [isWaitingForImage, setIsWaitingForImage] = useState(true);
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        //fetchSettings();      //fail since server doesnt work yet
        //fetchRoles();          //fail since server doesnt work yet
        const response = await api.get(`/game/image/${id}`);
        if (response.data.imageReady) {
          setImage(response.data.imageUrl);
          setIsWaitingForImage(false);
        } else {
          setTimeout(fetchImage, 5000);
        }
      } catch (error) {
        alert(`Failed to retrieve image: ${handleError(error)}`);
        setIsWaitingForImage(false);
      }
    };
    if (isWaitingForImage) {
      fetchImage();
    }
  }, [id, isWaitingForImage]);

  // Fetch lobby settings
  const fetchSettings = async () => {
    try {
      const response = await api.get(`/lobby/${id}`);
      setTimer(response.data.timerDuration || 30);
    } catch (error) {
      console.error(`Failed to fetch lobby settings: ${handleError(error)}`);
    }
  };

  // Fetch roles and determine creator
  const fetchRoles = async () => {
    try {
      const response = await api.get(`/game/roles/${id}`); //should be added in the REST Doc so we can see all users with their roles
      const creator = response.data.find((role) => role.type === "creator");
      setCreatorName(creator.name);
    } catch (error) {
      console.error(`Failed to fetch roles: ${handleError(error)}`);
    }
  };

  useEffect(() => {
    if (!isWaitingForImage && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, isWaitingForImage]);

  useEffect(() => {
    if (timer === 0) {
      alert("Time is up!");
      //navigate("/results");
    }
  }, [timer, navigate]);

  const sendGuess = async () => {
    try {
      const requestBody = JSON.stringify({
        description: imageDescriptionGuess,
      });
      // await api.post(`/game/guess/${id}`, requestBody);  //commented out since api not available atm
      alert("Guess submitted!");
      //navigate("/results");
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="join container">
        <div className="join form">
          {isWaitingForImage ? (
            <>
              <h2>Waiting for the image generation by DALL-E...</h2>
              <h3>
                {creatorName
                  ? `Image being created by ${creatorName}`
                  : "Fetching creator's name..."}
              </h3>
            </>
          ) : (
            <>
              <h3>Remaining time: {timer} seconds</h3>
              <h3>Image drawn by DALL-E</h3>
              {image && <img src={image} alt="Generated from DALL-E" />}
              <div className="register field">
                <label className="register label">
                  Type in your guess for the image description
                </label>
                <input
                  type="text"
                  className="register input"
                  placeholder="enter here.."
                  value={imageDescriptionGuess}
                  onChange={(e) => setImageDescriptionGuess(e.target.value)}
                />
              </div>
              <div className="register button-container">
                <Button
                  disabled={!imageDescriptionGuess || timer === 0}
                  width="100%"
                  onClick={sendGuess}
                >
                  Submit Guess
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </BaseContainer>
  );
};

export default GameGuess;
