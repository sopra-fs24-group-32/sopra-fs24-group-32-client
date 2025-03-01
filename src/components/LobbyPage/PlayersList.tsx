import React from 'react';
import { FaCrown, FaTimes } from 'react-icons/fa';
import './PlayersList.scss';

interface Player {
  id: string;
  username: string;
  avatarUrl?: string;
  isHost: boolean;
  isReady: boolean;
}

interface PlayersListProps {
  players: Player[];
  currentUserId?: string;
  isHost: boolean;
  onKickPlayer?: (playerId: string) => void;
}

const PlayersList: React.FC<PlayersListProps> = ({ 
  players, 
  currentUserId, 
  isHost,
  onKickPlayer 
}) => {
  // Sort players: host first, then alphabetically
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isHost && !b.isHost) return -1;
    if (!a.isHost && b.isHost) return 1;
    return a.username.localeCompare(b.username);
  });

  return (
    <div className="players-list-container">
      <h2 className="players-list-title">
        Players ({players.length}) 
        {players.length < 3 && <span className="min-players-warning"> (Need at least 3)</span>}
      </h2>
      
      <ul className="players-list">
        {sortedPlayers.map(player => (
          <li 
            key={player.id} 
            className={`player-item ${player.id === currentUserId ? 'is-current' : ''}`}
          >
            <div className="player-avatar">
              {player.avatarUrl ? (
                <img src={player.avatarUrl} alt={player.username} />
              ) : (
                <div className="avatar-placeholder">
                  {player.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="player-info">
              <div className="player-name">
                {player.username}
                {player.isHost && (
                  <span className="host-badge" title="Host">
                    <FaCrown />
                  </span>
                )}
              </div>
              
              <div className={`player-status ${player.isReady ? 'is-ready' : ''}`}>
                {player.isReady ? 'Ready' : 'Not Ready'}
              </div>
            </div>
            
            {isHost && !player.isHost && onKickPlayer && (
              <button 
                className="kick-button" 
                onClick={() => onKickPlayer(player.id)}
                aria-label={`Kick ${player.username}`}
              >
                <FaTimes />
                <span className="tooltip">Kick player</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersList;