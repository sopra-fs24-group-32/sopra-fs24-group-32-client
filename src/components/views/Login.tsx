import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/");
  };

  return (
    <LoginForm 
      onClose={handleClose} 
      initialMode="login"
    />
  );
};

export default Login;
