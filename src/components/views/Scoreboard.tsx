import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getDomain } from "helpers/getDomain";

const Scoreboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userToken = localStorage.getItem("userToken");
  const [playerGuessed, setPlayerGuessed] = useState("");
  const [timer, setTimer] = useState(30); // Default timer
  const [image, setImage] = useState("");
  const [isWaitingForImage, setIsWaitingForImage] = useState(true);
  const [creatorName, setCreatorName] = useState("");
  const [stompClient, setStompClient] = useState(null);

  //fetch score board values needs to be changed
  useEffect(() => {
    const fetchImage = async () => {
      //try {
      //fetchSettings(); //fail since server doesnt work yet
      //fetchRoles();          //fail since server doesnt work yet
      //const response = await api.get(`/game/image/${id}`);
      //if (response.data) {
      //  setImage(response.data);
      //  setIsWaitingForImage(false);
      //} else {
      //  setTimeout(fetchImage, 5000);
      //}
      //} catch (error) {
      //  alert(`Failed to retrieve image: ${handleError(error)}`);
      //setIsWaitingForImage(false);
      //}
      console.log("show score");
    };
    //fetchImage();
  }, [id]);

  // function need to be changed
  const continueGame = async () => {
    try {
      const timeGuessSubmitted = 10.0; // to be replaced with the actual time the guess was submitted
      const requestBody = JSON.stringify({ playerGuessed, timeGuessSubmitted });
      const userTokenJson = JSON.stringify({ userToken });
      const response = await api.put(`/game/chatgpt/${id}`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          userToken: userTokenJson,
        },
      }); //commented out since api not available atm
      navigate("/results");
    } catch (error) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  };

  const nextRound = () => {
    stompClient.send("/game/continueGame", {}, id);
  }

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
        const subscription = stompClient.subscribe(
          "/game/public",
          onMessageReceived
        );
      }
    };

    const onError = (error) => {
      console.log("Error:", error);
    };

    const onMessageReceived = (payload) => {
      const username = localStorage.getItem("username");

      const body = JSON.parse(payload.body);

      const nextPictureGenerator = body.username;

      if (username === nextPictureGenerator) {
        console.log("YOUR TURN TO GENERATE A PICTURE");
        //stompClient.disconnect();
        //navigate(`/game/create/${id}`);
      } else {
        console.log("YOUR TURN TO GUESS THE INPUT");
        //stompClient.disconnect();
        //navigate(`/game/guess/${id}`);
      }
    };
    if (stompClient) {
      stompClient.connect({}, onConnect, onError);
    }
  }, [stompClient]);

  //WEBSOCKET SUBSCRIPTION

  return (
    <BaseContainer>
      <div className="join container">
        <div className="join form">
          <div className="register button-container">
            <Button width="100%" onClick={continueGame}>
              Continue Game
            </Button>
            <Button width="100%" onClick={nextRound}>
              Next Round
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Scoreboard;
