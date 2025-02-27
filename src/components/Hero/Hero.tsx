import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './Hero.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../Modal/Modal';

const Hero = ({ onGetStartedClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalPurpose, setModalPurpose] = useState(''); // 'create' or 'join'
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const bgImages = [
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1024&auto=format&fit=crop', // Friends playing board games
    'https://images.unsplash.com/photo-1543269664-7eef42226a21?q=80&w=1024&auto=format&fit=crop', // Friends playing cards
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1024&auto=format&fit=crop', // People laughing together
    'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1024&auto=format&fit=crop', // Friends at a party
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1024&auto=format&fit=crop'  // People celebrating
  ];

  useEffect(() => {
    // Preload images
    bgImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImageLoaded(true);
    });

    const interval = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [bgImages.length]);

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

  const handleCreateGameClick = () => {
    if (isAuthenticated) {
      navigate('/lobby/create');
    } else {
      setModalPurpose('create');
      setLoginModalOpen(true);
    }
  };

  const handleJoinGameClick = () => {
    if (isAuthenticated) {
      navigate('/lobby/join');
    } else {
      setModalPurpose('join');
      setLoginModalOpen(true);
    }
  };

  const handleLoginClick = () => {
    setLoginModalOpen(false);
    navigate('/login');
  };

  const handleRegisterClick = () => {
    setLoginModalOpen(false);
    navigate('/register');
  };

  return (
    <section className="hero">
      {/* Background image carousel */}
      <div className="hero__background">
        {bgImages.map((img, index) => (
          <div 
            key={index} 
            className={`hero__background-image ${index === bgImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
      
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
            <button 
              className="hero__button hero__button--create"
              onClick={handleCreateGameClick}
            >
              <span className="hero__button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </span>
              <span className="hero__button-text">Create a New Game</span>
            </button>
            
            <button 
              className="hero__button hero__button--join"
              onClick={handleJoinGameClick}
            >
              <span className="hero__button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <span className="hero__button-text">Join a Game</span>
            </button>
          </div>
          
          <div className="hero__secondary-actions">
            <button 
              className="hero__button hero__button--outline hero__button--how-it-works"
              onClick={handleHowItWorksClick}
            >
              <span className="hero__button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </span>
              <span className="hero__button-text">How It Works</span>
            </button>
            
            {!isAuthenticated && (
              <button 
                className="hero__button hero__button--outline hero__button--get-started"
                onClick={onGetStartedClick}
              >
                <span className="hero__button-text">Get Started</span>
                <span className="hero__button-icon hero__button-icon--right">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </button>
            )}
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

      {/* Login Modal */}
      <Modal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        title={modalPurpose === 'create' ? "Create a New Game" : "Join a Game"}
      >
        <div className="hero__modal-content">
          <p>You need to be logged in to {modalPurpose === 'create' ? 'create' : 'join'} a game.</p>
          <div className="hero__modal-actions">
            <button 
              className="hero__button hero__button--primary hero__button--modal"
              onClick={handleLoginClick}
            >
              Log In
            </button>
            <button 
              className="hero__button hero__button--secondary hero__button--modal"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

// Add PropTypes validation for onGetStartedClick
Hero.propTypes = {
  onGetStartedClick: PropTypes.func.isRequired
};

export default Hero;