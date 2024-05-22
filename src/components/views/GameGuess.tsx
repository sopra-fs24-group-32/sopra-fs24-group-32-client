import React, { useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/GameGuess.scss";
import BaseContainer from "components/ui/BaseContainer";
import { ScaleLoader } from "react-spinners";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getDomain } from "helpers/getDomain";

const GameGuess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userToken = localStorage.getItem("userToken");
  const [playerGuessed, setPlayerGuessed] = useState("");
  const [timer, setTimer] = useState(30); // Default timer
  const [timeAvailable, setTimeAvailable] = useState(30); // default time available
  const [startTime, setStartTime] = useState(0);
  const [timeSubmitted, setTimeSubmitted] = useState(0);
  const [image, setImage] = useState("");
  const [isWaitingForImage, setIsWaitingForImage] = useState(true);
  const location = useLocation();
  const [stompClient, setStompClient] = useState(null);
  const { nextPictureGenerator } = location.state ?? {
    nextPictureGenerator: "No description provided",
  };
  const [playerSubmitted, setPlayerSubmitted] = useState(false);
  const timeoutRef = useRef(null);

  /*
  useEffect(() => {
    const fetchImage = async () => {
      clearTimeout(timeoutRef.current); // Clear existing timeout
      try {
        const response = await api.get(`/game/image/${id}`);
        console.log(response.data);
        if (response.data) {
          await fetchSettings();
          setImage(response.data);
          setIsWaitingForImage(false); // Stop further fetching
          setStartTime(Date.now());
        } else {
          // Re-run the fetchImage after a delay if the image isn't ready
          timeoutRef.current = setTimeout(fetchImage, 1000);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("--------------rerun--------------");
          // Try again after a delay if 404 (not found)
          timeoutRef.current = setTimeout(fetchImage, 1000);
        } else {
          // alert(`Failed to retrieve image: ${handleError(error)}`);
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "An unknown error occurred";
          alert(
            `${errorMessage}`
          );
          setIsWaitingForImage(false); // Stop further fetching on critical error
        }
      }
    };

    if (isWaitingForImage) {
      fetchImage();
    }
    // Cleanup function

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, isWaitingForImage]);
  
  */
  const fetchImage = async () => {
    try {
      //fetchRoles();          //fail since server doesnt work yet
      const response = await api.get(`/game/image/${id}`);
      console.log(response.data);
      if (response.data) {
        await fetchSettings();
        setImage(response.data);
        setIsWaitingForImage(false);
        //  setStartTime(Date.now());
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("--------------rerun--------------");
      } else {
        alert(`Failed to retrieve image: ${handleError(error)}`);
        //setIsWaitingForImage(false);
      }
    }
  };

  // Fetch lobby settings
  const fetchSettings = async () => {
    try {
      console.log("---------------setting fetch");
      const response = await api.get(`/lobby/${id}`);
      console.log("timelimit ------------------", response.data.timeLimit);
      setTimer(response.data.timeLimit || 30);
      setTimeAvailable(response.data.timeLimit || 30);
    } catch (error) {
      console.error(`Failed to fetch lobby settings: ${handleError(error)}`);
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
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

  // FALLBACK IF WEBSOCKETS FAIL OR COMPONENT IS RELOADED
  useEffect(() => {
    fetchImage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("timeout check");
      if (isWaitingForImage) {
        console.log("isWaitingForImage is true, fetching image...");
        fetchImage();
      }
    }, 50000);

    return () => clearTimeout(timer);
  }, [isWaitingForImage]);

  useEffect(() => {
    if (timer === 0) {
      if (!playerSubmitted) {
        console.log("--------------------------empty");
        sendEmptyGuess();
      }
      //navigate(`/game/scoreboard/${id}`);
    }
  }, [timer, navigate]);

  const sendEmptyGuess = async () => {
    try {
      const emptyString = "";
      console.log(
        "----------------------time avail",
        timeAvailable,
        emptyString
      );
      const requestBody = JSON.stringify({
        playerGuessed: emptyString,
        timeGuessSubmitted: timeAvailable,
      });
      const userTokenJson = JSON.stringify({ userToken });
      const response = await api.put(`/game/chatgpt/${id}`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          userToken: userTokenJson,
        },
      }); //commented out since api not available atm
      console.log("response ---------------------", playerGuessed, response);
      //notify the server and other players that time has run out for this player -> onMessageReceived in WEBSOCKET SUBSCRIPTION gets triggered
      stompClient.send(`/game/guessSubmitted/${id}`);
    } catch (error) {
      console.log(`Something went wrong: \n${handleError(error)}`);
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
    }
  };

  const sendGuess = async () => {
    try {
      setPlayerSubmitted(true);
      const endTime = Date.now();
      const elapsed = (endTime - startTime) / 1000;
      console.log(
        "--------------------------------time and guess",
        elapsed,
        playerGuessed
      );
      setTimeSubmitted(elapsed);
      const requestBody = JSON.stringify({
        playerGuessed: playerGuessed,
        timeGuessSubmitted: elapsed,
      });
      const userTokenJson = JSON.stringify({ userToken });
      const response = await api.put(`/game/chatgpt/${id}`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          userToken: userTokenJson,
        },
      }); //commented out since api not available atm
      console.log("response ---------------------", playerGuessed, response);
      //notify server and other players that this player has guessed -> onMessageReceived in WEBSOCKET SUBSCRIPTION gets triggered
      stompClient.send(`/game/guessSubmitted/${id}`);
      //navigate("/results");
    } catch (error) {
      console.log(`Something went wrong: \n${handleError(error)}`);
      console.error("Details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An unknown error occurred";
      alert(`${errorMessage}`);
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
    const onConnect = () => {
      if (stompClient) {
        // Existing subscriptions
        const everybodyGuessedSubscription = stompClient.subscribe(
          `/game/everybodyGuessed/${id}`,
          onMessageReceived
        );
        const receiveGeneratedPictureSubscription = stompClient.subscribe(
          `/game/receiveGeneratedPicture/${id}`,
          onPictureReceived
        );

        // New subscription for skip round messages
        const skipRoundSubscription = stompClient.subscribe(
          `/game/skipRound/${id}`,
          onSkipRoundReceived
        );

        return () => {
          everybodyGuessedSubscription.unsubscribe();
          receiveGeneratedPictureSubscription.unsubscribe();
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

    const onPictureReceived = async (payload) => {
      const parsedBody = JSON.parse(payload.body);
      setImage(parsedBody.body);
      await fetchSettings();
      setIsWaitingForImage(false);

      // this is now done in the img html directly to avoid timer starting before image is displayed
      // setStartTime(Date.now());
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

  return (
    <BaseContainer>
      <div className="guess container">
        <div className="guess form">
          {isWaitingForImage ? (
            <>
              <h2>Waiting for the image generation by DALL-E...</h2>
              <ScaleLoader
                color="#36d7b7"
                height={75}
                margin={4}
                radius={2}
                width={6}
              />
              <h3>Image being created by: {nextPictureGenerator}</h3>
            </>
          ) : (
            <>
              <h3 style={{ marginTop: "10px", marginBottom: "10px" }}>
                Remaining time: {timer} seconds
              </h3>
              <h3 style={{ marginTop: "0" }}>Image drawn by DALL-E</h3>
              {image && (
                <img
                  onLoad={() => {
                    setStartTime(Date.now());
                  }}
                  src={image}
                  width="60%"
                  alt="Generated from DALL-E"
                  style={{ maxHeight: "80vh" }}
                />
              )}
              <div className="guess field">
                <label className="guess label">
                  Type in your guess for the image description
                </label>
                <input
                  disabled={playerSubmitted}
                  type="text"
                  className="guess input"
                  placeholder="enter here.."
                  value={playerGuessed}
                  maxLength={40}
                  onChange={(e) => setPlayerGuessed(e.target.value)}
                />
                <span className="character-count">
                  {playerGuessed.length}/40
                </span>
              </div>
              <div className="guess button-container">
                <Button
                  disabled={!playerGuessed || timer === 0 || playerSubmitted}
                  width="50%"
                  onClick={sendGuess}
                >
                  Submit Guess
                </Button>
              </div>
            </>
          )}
          {playerSubmitted ? (
            <>
              <h3 className="guessTime">
                You submitted in {timeSubmitted} seconds!
              </h3>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </BaseContainer>
  );
};

export default GameGuess;
