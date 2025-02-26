// pages/HomePage.jsx
import React, { useState } from 'react';
import Hero from '../Hero/Hero';
import GameDescription from '../GameDescription/GameDescription';
import FeatureCards from '../FeatureCards/FeatureCards';
import LoginForm from '../LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleClose = () => {
    setShowLoginForm(false);
    navigate("/");
  };

  const handleToggleSignUp = (isSignUp) => {
    if (isSignUp) {
      navigate("/register");
    }
  };

  return (
    <div className="home-page">
      <Hero onGetStartedClick={handleLoginClick} />
      <GameDescription />
      <FeatureCards />
      
      {showLoginForm && (
        <LoginForm 
          onClose={handleClose} 
          onToggleMode={handleToggleSignUp}
          initialMode="login"
      />
      )}
    </div>
  );
};

export default HomePage;