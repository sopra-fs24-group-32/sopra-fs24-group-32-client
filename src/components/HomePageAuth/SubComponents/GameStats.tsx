import React from 'react';
import './GameStats.scss';

interface GameStatsProps {
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    highestScore: number;
    winRate: string;
  };
}

const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  return (
    <div className="game-stats">
      <h2 className="game-stats__title">Your Statistics</h2>
      <div className="game-stats__grid">
        <div className="game-stats__item">
          <div className="game-stats__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="game-stats__content">
            <h3 className="game-stats__label">Games Played</h3>
            <p className="game-stats__value">{stats.gamesPlayed}</p>
          </div>
        </div>
        
        <div className="game-stats__item">
          <div className="game-stats__icon game-stats__icon--win">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
            </svg>
          </div>
          <div className="game-stats__content">
            <h3 className="game-stats__label">Win Rate</h3>
            <p className="game-stats__value">{stats.winRate}</p>
          </div>
        </div>
        
        <div className="game-stats__item">
          <div className="game-stats__icon game-stats__icon--score">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
          <div className="game-stats__content">
            <h3 className="game-stats__label">Total Score</h3>
            <p className="game-stats__value">{stats.totalScore}</p>
          </div>
        </div>
        
        <div className="game-stats__item">
          <div className="game-stats__icon game-stats__icon--high">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="game-stats__content">
            <h3 className="game-stats__label">Highest Score</h3>
            <p className="game-stats__value">{stats.highestScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;