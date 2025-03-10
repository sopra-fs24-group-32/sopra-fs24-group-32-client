import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/GameCreate.scss";
import BaseContainer from "components/ui/BaseContainer";
import { ScaleLoader, PropagateLoader } from "react-spinners";

import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getDomain } from "helpers/getDomain";

const GameCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageDescription, setImageDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [timer, setTimer] = useState(30); // Default timer
  const [createTimer, setCreateTimer] = useState(30); // Default timer
  const [allGuessesSubmitted, setAllGuessesSubmitted] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [submitCount, setSubmitCount] = useState(0);

  useEffect(() => {
    if (createTimer > 0) {
      const countdown = setInterval(() => {
        setCreateTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [createTimer]);

  // timer no websocket
  /*useEffect(() => {
    if (createTimer === 0) {
      if (imageDescription.trim()) {
        sendDalle(); // Send description automatically if filled
      } else {
        console.log("---------------------------------navigate to scoreboard");
        //navigate(`/game/scoreboard/${id}`); // Navigate if description is empty
      }
    }
  }, [createTimer, navigate]);*/

  const sendDalle = async () => {
    setIsSubmitting(true);
    try {
      const userToken = localStorage.getItem("userToken");
      const userTokenJson = JSON.stringify({ userToken });
      const requestBody = JSON.stringify({ description: imageDescription });
      const response = await api.post(`/game/image/${id}`, requestBody, {
        headers: { userToken: userTokenJson },
      });
      console.log("________________-image from dalle", response.data);
      setGeneratedImage(response.data);

      await fetchGameSettings(); // Fetch or set the timer immediately after image is set
    } catch (error) {
      console.error(`Something went wrong: \n${handleError(error)}`);
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      //alert(`${errorMessage}`);

      //let creator generate another image when failing
      alert(
        "Please provide another description that can be generated by Dall-E"
      );
      setCreateTimer(30);
      setIsSubmitting(false);
    }
  };

  // Fetch timer settings and initialize the game timer
  const fetchGameSettings = async () => {
    try {
      const response = await api.get(`/lobby/${id}`);
      console.log("-----------------------settings response", response);
      setTimer(response.data.timeLimit || 30);
    } catch (error) {
      console.error("Failed to fetch lobby details:", handleError(error));
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
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

  /*
  useEffect(() => {
    if (timer === 0 || allGuessesSubmitted === true) {
      navigate(`/game/scoreboard/${id}`);
    }
  }, [timer, allGuessesSubmitted, navigate]);
  */

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

  //WEBSOCKET SUBSCRIPTION
  useEffect(() => {
    const connectAndSubscribeUserToSocket = async () => {
      const sock = new SockJS(getDomain() + "/ws");
      const client = over(sock, { websocket: { withCredentials: false } });
      setStompClient(client);
    };
    connectAndSubscribeUserToSocket();
  }, []);

  useEffect(() => {
    if (createTimer === 0) {
      if (!imageDescription) {
        if (stompClient && stompClient.connected) {
          // Send a skip message to the server, which should then broadcast to all clients
          stompClient.send(
            `/game/skipRound/${id}`,
            {},
            JSON.stringify({ skip: true })
          );
        }
        navigate(`/game/scoreboard/${id}`); // Navigate the creator directly without waiting for the message
      } else if (!isSubmitting) {
        sendDalle();
      }
    }
  }, [createTimer, imageDescription, id, navigate, sendDalle, stompClient]);

  useEffect(() => {
    const onConnect = () => {
      if (stompClient) {
        // Listening for the completion of guesses
        const everybodyGuessedSubscription = stompClient.subscribe(
          `/game/everybodyGuessed/${id}`,
          onMessageReceived
        );
        // Listening for the skip round message
        const skipRoundSubscription = stompClient.subscribe(
          `/game/skipRound/${id}`,
          onSkipRoundReceived
        );

        //not sure if needed
        return () => {
          everybodyGuessedSubscription.unsubscribe();
          skipRoundSubscription.unsubscribe();
        };
      }
    };

    const onMessageReceived = (payload) => {
      const allPlayersGuessed = JSON.parse(payload.body);
      if (allPlayersGuessed === true) {
        stompClient.disconnect();
        navigate(`/game/scoreboard/${id}`);
      }
    };

    const onSkipRoundReceived = (payload) => {
      const skipInfo = JSON.parse(payload.body);
      if (skipInfo.skip) {
        navigate(`/game/scoreboard/${id}`);
      }
    };

    const onError = (error) => {
      console.error("Error:", error);
    };

    if (stompClient) {
      stompClient.connect({}, onConnect, onError);
    }
  }, [stompClient, id, navigate]);

  //WEBSOCKET SUBSCRIPTION

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && imageDescription) {
      sendDalle();
    }
  };

  useEffect(() => {
    // Add event listener for the 'keydown' event
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageDescription]);

  return (
    <BaseContainer>
      <div className="create container">
        {isSubmitting ? (
          <div className="create form">
            {generatedImage ? (
              <>
                <h2>Your created Image:</h2>
                <img
                  style={{ maxHeight: "80vh" }}
                  src={generatedImage}
                  width="60%"
                  alt="Generated"
                />
                <p>Waiting for all players to submit their guesses...</p>
                <PropagateLoader color="#36d7b7" size={15} />
                <p>Time remaining: {timer} seconds</p>
              </>
            ) : (
              <>
                <h2>Your image is being created...</h2>
                <ScaleLoader
                  color="#36d7b7"
                  height={75}
                  margin={4}
                  radius={2}
                  width={6}
                />
              </>
            )}
            <h3>Description: {imageDescription}</h3>
          </div>
        ) : (
          <div className="create form">
            <h3>It is your turn to draw an image!</h3>
            <div className="create field">
              <label className="create label">
                Type in a text description of what you want DALL-E to draw
              </label>
              <input
                type="text"
                className="create input"
                placeholder="enter here.."
                value={imageDescription}
                maxLength={40}
                onChange={(e) => setImageDescription(e.target.value)}
              />
              <span className="character-count">
                {imageDescription.length}/40
              </span>
            </div>
            <div className="create button-container">
              <Button
                disabled={!imageDescription}
                width="50%"
                onClick={sendDalle}
              >
                Send to DALL-E
              </Button>
            </div>
            <p>Time remaining to submit description: {createTimer} seconds</p>
          </div>
        )}
      </div>
    </BaseContainer>
  );
};

export default GameCreate;
