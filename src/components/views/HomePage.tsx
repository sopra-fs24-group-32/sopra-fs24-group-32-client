import React from "react";
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

  return (
    <BaseContainer className="login form">
   
      <Button 
        width="100%"
        align="center"
        onClick={goToLoginPage}
      >
        Login
      </Button>

      <br></br>
      <br></br>
      <Button
        width="100%" 
        onClick={goToRegisterPage}
      >
      Register
      </Button>
    </BaseContainer>
  )
}

export default HomePage;