import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";

const Register = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/");
  };

  // Function to handle toggle to login
  const handleToggleMode = (isSignUp) => {
    if (!isSignUp) {
      navigate("/login");
    }
  };

  return (
    <LoginForm 
      onClose={handleClose} 
      initialMode="signup"
    />
  );
};

export default Register;
