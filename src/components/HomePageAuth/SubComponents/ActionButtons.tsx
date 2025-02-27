import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActionButtons.scss';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateLobby = () => {
    navigate('/lobby/create');
  };

  const handleJoinLobby = () => {
    navigate('/lobby/join');
  };

  const handleUpdateProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="action-buttons">
      <h2 className="action-buttons__title">Quick Actions</h2>
      
      <div className="action-buttons__grid">
        <button 
          className="action-buttons__button action-buttons__button--create"
          onClick={handleCreateLobby}
        >
          <div className="action-buttons__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div className="action-buttons__content">
            <h3 className="action-buttons__button-title">Create Lobby</h3>
            <p className="action-buttons__button-desc">Create a new game lobby and invite friends to play</p>
          </div>
          <div className="action-buttons__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </button>
        
        <button 
          className="action-buttons__button action-buttons__button--join"
          onClick={handleJoinLobby}
        >
          <div className="action-buttons__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          <div className="action-buttons__content">
            <h3 className="action-buttons__button-title">Join Lobby</h3>
            <p className="action-buttons__button-desc">Join an existing game using an invitation code</p>
          </div>
          <div className="action-buttons__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </button>
        
        <button 
          className="action-buttons__button action-buttons__button--profile"
          onClick={handleUpdateProfile}
        >
          <div className="action-buttons__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="action-buttons__content">
            <h3 className="action-buttons__button-title">Update Profile</h3>
            <p className="action-buttons__button-desc">Personalize your profile settings and avatar</p>
          </div>
          <div className="action-buttons__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;