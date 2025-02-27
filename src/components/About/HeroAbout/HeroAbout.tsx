// components/About/HeroAbout/HeroAbout.jsx
import React, { useEffect, useState } from 'react';
import './HeroAbout.scss';

const HeroAbout = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation delay for entrance effects
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`hero-about ${isVisible ? 'hero-about--visible' : ''}`}>
      {/* Animated background elements */}
      <div className="hero-about__bg-shapes">
        <div className="hero-about__shape hero-about__shape--1"></div>
        <div className="hero-about__shape hero-about__shape--2"></div>
        <div className="hero-about__shape hero-about__shape--3"></div>
        <div className="hero-about__shape hero-about__shape--4"></div>
      </div>
      
      <div className="hero-about__overlay"></div>
      
      <div className="container">
        <div className="hero-about__content">
          <div className="hero-about__badge">Explore the Game</div>
          
          <h1 className="hero-about__title">
            About <span className="hero-about__title-highlight">GPTuessr</span>
          </h1>
          
          <p className="hero-about__subtitle">
            The ultimate AI-powered guessing game that brings creativity and fun together
          </p>
          
          <div className="hero-about__features">
            <div className="hero-about__feature">
              <div className="hero-about__feature-icon">🎮</div>
              <div className="hero-about__feature-text">Interactive gameplay</div>
            </div>
            <div className="hero-about__feature">
              <div className="hero-about__feature-icon">🤖</div>
              <div className="hero-about__feature-text">AI-powered images</div>
            </div>
            <div className="hero-about__feature">
              <div className="hero-about__feature-icon">🏆</div>
              <div className="hero-about__feature-text">Competitive fun</div>
            </div>
          </div>
          
          <div className="hero-about__buttons">
            <a href="/register" className="hero-about__button hero-about__button--primary">
              Join Now
              <span className="hero-about__button-arrow">→</span>
            </a>
            <a href="#how-to-play" className="hero-about__button hero-about__button--secondary">
              How It Works
            </a>
          </div>
        </div>
        
        <div className="hero-about__visual">
          <div className="hero-about__image-container">
            <div className="hero-about__image-frame"></div>
            
            <div className="hero-about__decoration hero-about__decoration--1">
              <span className="hero-about__emoji">🤔</span>
            </div>
            <div className="hero-about__decoration hero-about__decoration--2">
              <span className="hero-about__emoji">💡</span>
            </div>
            <div className="hero-about__decoration hero-about__decoration--3">
              <span className="hero-about__emoji">🎮</span>
            </div>
            
            <div className="hero-about__image-wrapper">
              <img 
                src="/images/hero-illustration.svg" 
                alt="GPTuessr game illustration" 
                className="hero-about__image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500x400?text=GPTuessr+Game";
                }}
              />
              <div className="hero-about__image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-about__scroll-down">
        <a href="#game-description-about" aria-label="Scroll down">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      
      <div className="hero-about__wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,181.3C672,171,768,181,864,181.3C960,181,1056,171,1152,186.7C1248,203,1344,245,1392,266.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroAbout;