import React from 'react';
import './PlayerList.scss';

interface Player {
  id: number;
  username: string;
  isHost: boolean;
  isReady: boolean;
  avatarUrl: string;
}

interface PlayerListProps {
  players: Player[];
  onKickPlayer: (playerId: number) => void;
  isHost: boolean;
  currentUserId: number;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onKickPlayer, isHost, currentUserId }) => {
  return (
    <div className="player-list">
      <div className="player-list__header">
        <h2 className="player-list__title">Players</h2>
        <span className="player-list__count">{players.length} joined</span>
      </div>
      
      <div className="player-list__content">
        {players.length === 0 ? (
          <div className="player-list__empty">
            No players have joined the lobby yet.
          </div>
        ) : (
          <div className="player-list__items">
            {players.map((player, index) => (
              <div 
                key={player.id}
                className="player-list__item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="player-list__player-info">
                  <div className="player-list__avatar">
                    <img 
                      src={player.avatarUrl} 
                      alt={player.username} 
                      className="player-list__avatar-img" 
                    />
                  </div>
                  
                  <div className="player-list__details">
                    <div className="player-list__name">
                      {player.username}
                      {player.isHost && (
                        <span className="player-list__host-badge" title="Host">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </span>
                      )}
                    </div>
                    
                    {player.id === currentUserId && (
                      <span className="player-list__current-user">You</span>
                    )}
                  </div>
                </div>
                
                <div className="player-list__status">
                  {player.isReady ? (
                    <span className="player-list__ready">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Ready
                    </span>
                  ) : (
                    <span className="player-list__not-ready">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Not Ready
                    </span>
                  )}
                </div>
                
                {isHost && !player.isHost && (
                  <button 
                    className="player-list__kick-btn" 
                    onClick={() => onKickPlayer(player.id)}
                    title="Kick player"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;