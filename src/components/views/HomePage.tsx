import React, { useState, useEffect } from "react";
import {Button} from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";    

const HomePage = () => {

  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate("/login");
  }

  const goToRegisterPage = () => {
    navigate("/register");
  }

  const fullText = "Welcome to the exciting world of GPTuessr, a cutting-edge online multiplayer game that blends the classic fun of drawing and guessing games with the latest in AI-driven art technology. At the heart of GPTuessr is our innovative use of DALL-E, an advanced AI that generates stunning images in real-time based on player descriptions. Invite your friends at GPTuessr, where every game is an adventure in creativity and fun!";
  const [animatedText, setAnimatedText] = useState("");
  const words = fullText.split(" ");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length) {
      const timeoutId = setTimeout(() => {
        setAnimatedText((prev) => prev + " " + words[index]);
        setIndex((prev) => prev + 1);
      }, 100); // Adjust time here to control speed

      return () => clearTimeout(timeoutId);
    }
  }, [index, words]);

  return (
    <div>
      <div className="backgroundContainer"></div> {/* Background Image Container */}
      <BaseContainer className="login form">
        <p>{animatedText}</p>
        <Button width="100%" align="center" onClick={goToLoginPage}>
          Login
        </Button>
        <br /><br />
        <Button width="100%" onClick={goToRegisterPage}>
          Register
        </Button>
      </BaseContainer>
    </div>
  );
}

export default HomePage;