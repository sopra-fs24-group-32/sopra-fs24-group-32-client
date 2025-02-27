import React from 'react';
import './WelcomeHeader.scss';

interface WelcomeHeaderProps {
  username: string;
  profilePicture?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username, profilePicture }) => {
  // Get current time to personalize greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="welcome-header">
      <div className="welcome-header__content">
        <div className="welcome-header__text">
          <h1 className="welcome-header__greeting">{getCurrentGreeting()}, <span>{username}!</span></h1>
          <p className="welcome-header__message">
            Welcome to your GPTuessr dashboard. Ready to play a game of AI-generated art and guessing?
          </p>
        </div>
        
        <div className="welcome-header__profile">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt={`${username}'s profile`} 
              className="welcome-header__avatar"
            />
          ) : (
            <div className="welcome-header__avatar-placeholder">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      
      <div className="welcome-header__decoration">
        <div className="welcome-header__decoration-item"></div>
        <div className="welcome-header__decoration-item"></div>
        <div className="welcome-header__decoration-item"></div>
      </div>
    </div>
  );
};

export default WelcomeHeader;