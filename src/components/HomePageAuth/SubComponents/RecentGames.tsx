import React from 'react';
import './RecentGames.scss';

interface Game {
  id: number;
  date: string;
  players: string[];
  winner: string;
  score: number;
}

interface RecentGamesProps {
  games: Game[];
}

const RecentGames: React.FC<RecentGamesProps> = ({ games }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="recent-games">
      <div className="recent-games__header">
        <h2 className="recent-games__title">Recent Games</h2>
        {games.length > 0 && (
          <button className="recent-games__view-all">View All</button>
        )}
      </div>
      
      {games.length === 0 ? (
        <div className="recent-games__empty">
          <div className="recent-games__empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="recent-games__empty-text">You haven&apos;t played any games yet.</p>
          <p className="recent-games__empty-subtext">Create or join a lobby to start playing!</p>
        </div>
      ) : (
        <div className="recent-games__list">
          {games.map((game, index) => (
            <div className="recent-games__item" key={game.id}>
              <div 
                className="recent-games__item-number" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {index + 1}
              </div>
              
              <div className="recent-games__item-content">
                <div className="recent-games__item-header">
                  <h3 className="recent-games__item-date">{formatDate(game.date)}</h3>
                  <span className="recent-games__item-score">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {game.score} pts
                  </span>
                </div>
                
                <div className="recent-games__item-players">
                  <span className="recent-games__item-players-label">Players:</span>
                  <div className="recent-games__item-players-list">
                    {game.players.map((player, i) => (
                      <span 
                        key={i} 
                        className={`recent-games__item-player ${player === game.winner ? 'recent-games__item-player--winner' : ''}`}
                      >
                        {player}
                        {player === game.winner && (
                          <svg className="recent-games__crown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
                            <path d="M19 19H5v2h14v-2z"/>
                          </svg>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="recent-games__item-footer">
                  <span className="recent-games__item-winner">
                    Winner: <strong>{game.winner}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentGames;