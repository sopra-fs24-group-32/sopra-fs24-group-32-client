// components/GameSummary/GameSummary.tsx
import React, { useState, useEffect, useRef } from 'react';
import './GameSummary.scss';

const GameSummary = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const summaryRef = useRef(null);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (summaryRef.current) {
      observer.observe(summaryRef.current);
    }

    return () => {
      if (summaryRef.current) {
        observer.unobserve(summaryRef.current);
      }
    };
  }, []);

  // Particle configuration
  const particleCount = 20;
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5
  }));

  return (
    <section 
      className={`game-summary ${isVisible ? 'is-visible' : ''}`}
      ref={summaryRef}
      id="game-summary"
    >
      {/* Background particles */}
      <div className="game-summary__particles">
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="game-summary__particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>
      
      {/* Gradient background blobs */}
      <div className="game-summary__blob game-summary__blob--1"></div>
      <div className="game-summary__blob game-summary__blob--2"></div>
      
      <div className="game-summary__container">
        <div className="game-summary__content">
          <div className="game-summary__icon-container">
            <div className="game-summary__icon-ring"></div>
            <div className="game-summary__icon">✨</div>
          </div>
          
          <h2 className="game-summary__title">
            Where <span className="game-summary__highlight">Creativity</span> Meets <span className="game-summary__highlight">Technology</span>
          </h2>
          
          <div className="game-summary__divider">
            <div className="game-summary__divider-line"></div>
            <div className="game-summary__divider-dot"></div>
            <div className="game-summary__divider-line"></div>
          </div>
          
          <div className="game-summary__text">
            <p>
              GPTuessr sits at the intersection of gaming, social interaction, and artificial intelligence. It&apos;s not just a game; it&apos;s a new way to engage with friends and technology alike.
            </p>
            <p>
              Join our community today and discover why thousands of players are making GPTuessr their go-to game for creative entertainment.
            </p>
          </div>
          
          <div className="game-summary__cta-container">
            <a 
              href="/signup" 
              className={`game-summary__cta ${isHovered ? 'is-hovered' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="game-summary__cta-text">Join the Community</span>
              <div className="game-summary__cta-icon-container">
                <svg className="game-summary__cta-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="game-summary__cta-background"></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameSummary;