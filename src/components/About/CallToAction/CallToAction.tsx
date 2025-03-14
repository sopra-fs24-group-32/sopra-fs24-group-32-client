// components/About/CallToAction/CallToAction.jsx
import React from 'react';
import './CallToAction.scss';

const CallToAction = () => {
  return (
    <section className="call-to-action" id="join-now">
      <div className="container">
        <div className="call-to-action__content">
          <h2 className="call-to-action__title">Ready to Start Your GPTuessr Journey?</h2>
          <p className="call-to-action__description">
            Join thousands of players around the world in the most creative AI-powered guessing game. Create your first lobby and invite friends in minutes!
          </p>
         
          <div className="call-to-action__features">
            <div className="call-to-action__feature">
              <div className="call-to-action__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 10H7C4.79086 10 3 11.7909 3 14V18C3 20.2091 4.79086 22 7 22H17C19.2091 22 21 20.2091 21 18V14C21 11.7909 19.2091 10 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2L12 6L16 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="call-to-action__feature-text">
                <h3>Free to Start</h3>
                <p>Create game lobbies and play with friends at no cost</p>
              </div>
            </div>
            <div className="call-to-action__feature">
              <div className="call-to-action__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9986 17.1771 21.7315 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C17.7356 3.58399 19.0072 5.17838 19.0072 7.005C19.0072 8.83162 17.7356 10.426 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="call-to-action__feature-text">
                <h3>Multiplayer Fun</h3>
                <p>Private lobbies with up to 10 friends per game</p>
              </div>
            </div>
            <div className="call-to-action__feature">
              <div className="call-to-action__feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="call-to-action__feature-text">
                <h3>AI-Powered</h3>
                <p>State-of-the-art DALL-E image generation</p>
              </div>
            </div>
          </div>
         
          <div className="call-to-action__buttons">
            <a href="/register" className="call-to-action__button call-to-action__button--primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="call-to-action__button-icon">
                <path d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Free Account
            </a>
            <a href="/premium" className="call-to-action__button call-to-action__button--secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="call-to-action__button-icon">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Explore Premium
            </a>
          </div>
          
          <div className="call-to-action__testimonial">
            <div className="call-to-action__testimonial-quote">
            &quot;GPTuessr has completely transformed our virtual game nights. It&apos;s now our go-to activity!&quot;
            </div>
            <div className="call-to-action__testimonial-author">
              — Emily R., Premium Member
            </div>
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