// components/Hero/Hero.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './Hero.scss';
import { useLocation, useNavigate } from 'react-router-dom';

const Hero = ({ onGetStartedClick }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const handleHowItWorksClick = () => {
    if (location.pathname === "/about") {
      // If already on /about, scroll smoothly to #how-to-play
      const element = document.getElementById("how-to-play");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to /about#how-to-play
      navigate("/about#how-to-play");
    }
  };
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">
            Draw, Guess, and Play with <span className="hero__title--highlight">AI</span>
          </h1>
          <p className="hero__subtitle">
            Join the most creative multiplayer guessing game powered by DALL-E.
            Create amazing AI-generated art from text prompts and challenge
            your friends to guess what you described!
          </p>
          <div className="hero__actions">
            <Button
              label="Get Started"
              variant="primary"
              size="large"
              onClick={onGetStartedClick}
            />
            <Button
              label="How It Works"
              variant="secondary"
              size="large"
              onClick={handleHowItWorksClick}
            />
          </div>
          <div className="hero__stats">
            <div className="hero__stat hero__stat--players">
                <div className="hero__stat-box">
                <span className="hero__stat-number">10k+</span>
                <span className="hero__stat-label">Active Players</span>
                </div>
            </div>
            <div className="hero__stat hero__stat--games">
                <div className="hero__stat-box">
                <span className="hero__stat-number">50k+</span>
                <span className="hero__stat-label">Games Played</span>
                </div>
            </div>
            <div className="hero__stat hero__stat--rating">
                <div className="hero__stat-box">
                <span className="hero__stat-number">4.8</span>
                <span className="hero__stat-label">User Rating</span>
                </div>
            </div>
          </div>
        </div>
        <div className="hero__image">
          <div className="hero__image-wrapper">
            <div className="hero__image-ai-art"></div>
            <div className="hero__image-decoration"></div>
          </div>
        </div>
      </div>
      <div className="hero__shape-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

// Add PropTypes validation for onGetStartedClick
Hero.propTypes = {
  onGetStartedClick: PropTypes.func.isRequired
};

export default Hero;