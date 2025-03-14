// components/About/HeroAbout/HeroAbout.tsx
import React, { useEffect, useState } from 'react';
import './HeroAbout.scss';

const HeroAbout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState(0);
  const emojis = ['🎮', '🤔', '💡', '🏆', '🤖'];

  useEffect(() => {
    // Animation delay for entrance effects
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Rotating emoji animation
    const emojiInterval = setInterval(() => {
      setActiveEmoji((prev) => (prev + 1) % emojis.length);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(emojiInterval);
    };
  }, []);

  return (
    <section className={`hero-about ${isVisible ? 'hero-about--visible' : ''}`} style={{ marginTop: '-1px' }}>
      {/* Animated particles background */}
      <div className="hero-about__particles">
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={index}
            className={`hero-about__particle hero-about__particle--${index % 4 + 1}`}
            style={{ 
              animationDelay: `${index * 0.2}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
      
      {/* Gradient overlay */}
      <div className="hero-about__gradient-overlay"></div>
      
      <div className="container">
        <div className="hero-about__content">
          <div className="hero-about__badge" data-aos="fade-down">
            <span className="hero-about__badge-text">AI-Powered Guessing Game</span>
          </div>
          
          <h1 className="hero-about__title" data-aos="fade-up" data-aos-delay="100">
            About <span className="hero-about__title-highlight">GPTuessr</span>
          </h1>
          
          <p className="hero-about__subtitle" data-aos="fade-up" data-aos-delay="200">
            The ultimate AI-powered guessing game that brings creativity, 
            technology, and fun together in a unique social experience
          </p>
          
          <div className="hero-about__features" data-aos="fade-up" data-aos-delay="300">
            <div className="hero-about__feature">
              <div className="hero-about__feature-icon-inner">🎮</div>
              <h3 className="hero-about__feature-title">Interactive Gameplay</h3>
              <p className="hero-about__feature-description">Engaging rounds of guessing and creating</p>
            </div>
            
            <div className="hero-about__feature">
              <div className="hero-about__feature-icon-inner">🤖</div>
              <h3 className="hero-about__feature-title">AI Magic</h3>
              <p className="hero-about__feature-description">Powered by DALL-E image generation</p>
            </div>
            
            <div className="hero-about__feature">
              <div className="hero-about__feature-icon-inner">🏆</div>
              <h3 className="hero-about__feature-title">Compete & Win</h3>
              <p className="hero-about__feature-description">Climb the leaderboard with friends</p>
            </div>
          </div>
          
          <div className="hero-about__buttons" data-aos="fade-up" data-aos-delay="400">
            <a href="/register" className="hero-about__button hero-about__button--primary">
              <span className="hero-about__button-text">Join Now</span>
              <span className="hero-about__button-icon">→</span>
            </a>
            <a href="#how-to-play" className="hero-about__button hero-about__button--secondary">
              How It Works
            </a>
          </div>
        </div>
        
        <div className="hero-about__visual" data-aos="zoom-in" data-aos-delay="500">
          <div className="hero-about__image-container">
            <div className="hero-about__3d-card">
              <div className="hero-about__3d-card-inner">
                <div className="hero-about__image-frame"></div>
                
                <div className="hero-about__decoration hero-about__decoration--1">
                  <span className="hero-about__emoji hero-about__emoji--animated">
                    {emojis[activeEmoji]}
                  </span>
                </div>
                
                <div className="hero-about__decoration hero-about__decoration--2">
                  <span className="hero-about__emoji">💭</span>
                </div>
                
                <div className="hero-about__decoration hero-about__decoration--3">
                  <span className="hero-about__emoji">✨</span>
                </div>
                
                <div className="hero-about__image-wrapper">
                  <div className="hero-about__image-glow"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop"
                    alt="GPTuessr game illustration - AI generated art concept" 
                    className="hero-about__image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop";
                    }}
                  />
                  <div className="hero-about__image-reflection"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-about__scroll-indicator" data-aos="fade-up" data-aos-delay="600">
        <a href="#game-description-about" aria-label="Scroll down">
          <div className="hero-about__scroll-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="hero-about__scroll-text">Discover More</span>
        </a>
      </div>
      
      <div className="hero-about__wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="var(--color-background, #ffffff)" fillOpacity="1" d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,181.3C672,171,768,181,864,181.3C960,181,1056,171,1152,186.7C1248,203,1344,245,1392,266.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroAbout;