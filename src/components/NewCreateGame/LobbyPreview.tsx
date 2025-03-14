import React from 'react';
import { GameSettings } from './CreateGame';
import './LobbyPreview.scss';

interface LobbyPreviewProps {
  settings: GameSettings;
  host: string;
}

const LobbyPreview: React.FC<LobbyPreviewProps> = ({ settings, host }) => {
  // Generate a random invitation code
  const invitationCode = Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 36).toString(36).toUpperCase()
  ).join('');

  // Create mock players array with host and empty slots
  const players = [
    { id: 1, username: host, isHost: true, isReady: true },
    ...Array(settings.maxPlayers - 1).fill(null).map((_, index) => ({
      id: index + 2,
      username: null,
      isHost: false,
      isReady: false
    }))
  ];

  return (
    <div className="lobby-preview">
      <div className="lobby-preview__header">
        <h2 className="lobby-preview__title">{settings.lobbyName}</h2>
        {settings.isPrivate && (
          <div className="lobby-preview__code">
            <span>Invitation Code:</span>
            <code>{invitationCode}</code>
          </div>
        )}
      </div>

      <div className="lobby-preview__info">
        <div className="lobby-preview__info-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Time Limit: {settings.timeLimit} seconds</span>
        </div>
        <div className="lobby-preview__info-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Rounds: {settings.rounds}</span>
        </div>
        <div className="lobby-preview__info-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>Players: {settings.maxPlayers} max</span>
        </div>
        <div className="lobby-preview__info-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>{settings.isPrivate ? 'Private Lobby' : 'Public Lobby'}</span>
        </div>
      </div>

      <div className="lobby-preview__players">
        <h3>Players</h3>
        <div className="lobby-preview__players-list">
          {players.map(player => (
            <div 
              key={player.id} 
              className={`lobby-preview__player ${player.username ? 'active' : 'empty'}`}
            >
              <div className="lobby-preview__player-avatar">
                {player.username ? player.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="lobby-preview__player-info">
                <span className="lobby-preview__player-name">
                  {player.username ? player.username : 'Empty Slot'}
                </span>
                {player.isHost && (
                  <span className="lobby-preview__player-host">Host</span>
                )}
              </div>
              {player.username && (
                <div className="lobby-preview__player-status">
                  {player.isReady ? 'Ready' : 'Not Ready'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lobby-preview__waiting">
        <p>Waiting for players to join...</p>
        <p className="lobby-preview__help">
          After creating the game, you can invite friends to join using the invitation code.
        </p>
      </div>
    </div>
  );
};

export default LobbyPreview;