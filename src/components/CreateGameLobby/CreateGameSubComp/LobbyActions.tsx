import React from 'react';
import './LobbyActions.scss';

interface LobbyActionsProps {
  onStartGame: () => void;
  onCancel: () => void;
  isStartDisabled: boolean;
  playerCount: number;
  isSaving: boolean;
}

const LobbyActions: React.FC<LobbyActionsProps> = ({ 
  onStartGame, 
  onCancel, 
  isStartDisabled, 
  playerCount,
  isSaving
}) => {
  return (
    <div className="lobby-actions">
      <h2 className="lobby-actions__title">Actions</h2>
      
      <div className="lobby-actions__buttons">
        <button 
          className="lobby-actions__start-btn" 
          onClick={onStartGame}
          disabled={isStartDisabled || isSaving}
        >
          {isSaving ? (
            <>
              <svg className="lobby-actions__spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
              </svg>
              Starting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Start Game
            </>
          )}
        </button>
        
        <button className="lobby-actions__cancel-btn" onClick={onCancel} disabled={isSaving}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Cancel
        </button>
      </div>
      
      {isStartDisabled && (
        <div className="lobby-actions__warning">
          {playerCount < 3 ? (
            <p>Need at least 3 players to start</p>
          ) : (
            <p>All players must be ready to start</p>
          )}
        </div>
      )}
      
      <div className="lobby-actions__help">
        <h3 className="lobby-actions__help-title">Game Info</h3>
        <ul className="lobby-actions__help-list">
          <li className="lobby-actions__help-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Each player gets a turn to create an AI image</span>
          </li>
          <li className="lobby-actions__help-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Other players guess what the prompt was</span>
          </li>
          <li className="lobby-actions__help-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Points are awarded for close guesses</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LobbyActions;