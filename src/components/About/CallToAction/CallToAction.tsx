// components/About/CallToAction/CallToAction.jsx
import React from 'react';
import './CallToAction.scss';

const CallToAction = () => {
  return (
    <section className="call-to-action">
      <div className="container">
        <div className="call-to-action__content">
          <h2 className="call-to-action__title">Ready to Start Your GPTuessr Journey?</h2>
          <p className="call-to-action__description">
            Join thousands of players around the world in the most creative AI guessing game. Sign up now to get started with your first game!
          </p>
          
          <div className="call-to-action__features">
            <div className="call-to-action__feature">
              <div className="call-to-action__feature-icon">🎮</div>
              <div className="call-to-action__feature-text">Free to start playing</div>
            </div>
            <div className="call-to-action__feature">
              <div className="call-to-action__feature-icon">👥</div>
              <div className="call-to-action__feature-text">Invite friends instantly</div>
            </div>
            <div className="call-to-action__feature">
              <div className="call-to-action__feature-icon">🚀</div>
              <div className="call-to-action__feature-text">New game modes monthly</div>
            </div>
          </div>
          
          <div className="call-to-action__buttons">
            <a href="/signup" className="call-to-action__button call-to-action__button--primary">
              Create Free Account
            </a>
            <a href="/premium" className="call-to-action__button call-to-action__button--secondary">
              Explore Premium Features
            </a>
          </div>
        </div>
      </div>
      
      <div className="call-to-action__decoration call-to-action__decoration--1"></div>
      <div className="call-to-action__decoration call-to-action__decoration--2"></div>
      <div className="call-to-action__decoration call-to-action__decoration--3"></div>
    </section>
  );
};

export default CallToAction;