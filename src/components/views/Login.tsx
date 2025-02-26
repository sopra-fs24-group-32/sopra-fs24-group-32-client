import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/");
  };

  const handleToggleSignUp = (isSignUp) => {
    if (isSignUp) {
      navigate("/register");
    }
  };

  return (
    <LoginForm 
      onClose={handleClose} 
      onToggleMode={handleToggleSignUp}
      initialMode="login"
    />
  );
};

export default Login;
