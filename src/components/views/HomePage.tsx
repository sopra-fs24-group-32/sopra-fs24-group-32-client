// pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../Hero/Hero';
import GameDescription from '../GameDescription/GameDescription';
import FeatureCards from '../FeatureCards/FeatureCards';
import LoginForm from '../LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';
import DashboardSample from '../Dashboard/DashboardSample';
import HowToPlay from 'components/About/HowToPlay/HowToPlay';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Add animation trigger when component mounts
  useEffect(() => {
    // Small delay to ensure animation works
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

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
      {/* <HowToPlay /> */}
      <FeatureCards />

      {/* Dashboard Sample component with enhanced container */}

      <DashboardSample />


      
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