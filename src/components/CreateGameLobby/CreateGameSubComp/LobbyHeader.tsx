import React, { useState } from 'react';
import './LobbyHeader.scss';

interface LobbyHeaderProps {
  lobbyCode: string;
  playerCount: number;
  maxPlayers: number;
}

const LobbyHeader: React.FC<LobbyHeaderProps> = ({ lobbyCode, playerCount, maxPlayers }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="lobby-header">
      <div className="lobby-header__content">
        <div className="lobby-header__title-section">
          <h1 className="lobby-header__title">Create Game Lobby</h1>
          <p className="lobby-header__subtitle">
            Set up your game preferences and invite friends to play
          </p>
        </div>
        
        <div className="lobby-header__info">
          <div className="lobby-header__code">
            <h2 className="lobby-header__code-label">Lobby Code:</h2>
            <div className="lobby-header__code-display">
              {lobbyCode.split('').map((char, index) => (
                <span key={index} className="lobby-header__code-char">{char}</span>
              ))}
            </div>
            <button 
              className={`lobby-header__code-copy ${copied ? 'lobby-header__code-copy--copied' : ''}`}
              onClick={handleCopyCode}
              aria-label="Copy lobby code"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          
          <div className="lobby-header__players">
            <div className="lobby-header__players-count">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{playerCount}/{maxPlayers}</span>
            </div>
            <div className="lobby-header__players-progress">
              <div 
                className="lobby-header__players-bar" 
                style={{ width: `${(playerCount / maxPlayers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lobby-header__decoration">
        <div className="lobby-header__decoration-item"></div>
        <div className="lobby-header__decoration-item"></div>
        <div className="lobby-header__decoration-item"></div>
      </div>
    </div>
  );
};

export default LobbyHeader;