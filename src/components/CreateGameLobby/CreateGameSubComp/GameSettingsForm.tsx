import React, { useState } from 'react';
import './GameSettingsForm.scss';

interface GameSettingsFormProps {
  settings: {
    rounds: number;
    timeLimit: number;
    maxPlayers: number;
    isPrivate: boolean;
    difficulty: string;
    categories: string[];
  };
  onSettingsChange: (newSettings: any) => void;
}

const GameSettingsForm: React.FC<GameSettingsFormProps> = ({ settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('basic');
  
  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      onSettingsChange({ rounds: value });
    }
  };
  
  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 20 && value <= 180) {
      onSettingsChange({ timeLimit: value });
    }
  };
  
  const handleMaxPlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 3 && value <= 12) {
      onSettingsChange({ maxPlayers: value });
    }
  };
  
  const handlePrivacyChange = (isPrivate: boolean) => {
    onSettingsChange({ isPrivate });
  };
  
  const handleDifficultyChange = (difficulty: string) => {
    onSettingsChange({ difficulty });
  };
  
  const handleCategoryToggle = (category: string) => {
    const updatedCategories = settings.categories.includes(category)
      ? settings.categories.filter(c => c !== category)
      : [...settings.categories, category];
    
    onSettingsChange({ categories: updatedCategories });
  };
  
  const allCategories = [
    { id: 'animals', label: 'Animals' },
    { id: 'nature', label: 'Nature' },
    { id: 'food', label: 'Food & Drinks' },
    { id: 'travel', label: 'Travel' },
    { id: 'sports', label: 'Sports' },
    { id: 'art', label: 'Art' },
    { id: 'technology', label: 'Technology' },
    { id: 'movies', label: 'Movies & TV' },
    { id: 'music', label: 'Music' },
    { id: 'history', label: 'History' }
  ];

  return (
    <div className="game-settings-form">
      <h2 className="game-settings-form__title">Game Settings</h2>
      
      <div className="game-settings-form__tabs">
        <button 
          className={`game-settings-form__tab ${activeTab === 'basic' ? 'game-settings-form__tab--active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Settings
        </button>
        <button 
          className={`game-settings-form__tab ${activeTab === 'advanced' ? 'game-settings-form__tab--active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Options
        </button>
      </div>
      
      <div className="game-settings-form__content">
        {activeTab === 'basic' ? (
          <div className="game-settings-form__basic-settings">
            <div className="game-settings-form__setting">
              <label className="game-settings-form__label" htmlFor="rounds">
                Number of Rounds
                <span className="game-settings-form__value">{settings.rounds}</span>
              </label>
              <div className="game-settings-form__slider-container">
                <input 
                  type="range" 
                  id="rounds" 
                  className="game-settings-form__slider" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={settings.rounds}
                  onChange={handleRoundsChange}
                />
                <div className="game-settings-form__slider-labels">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
            
            <div className="game-settings-form__setting">
              <label className="game-settings-form__label" htmlFor="timeLimit">
                Time Limit (seconds)
                <span className="game-settings-form__value">{settings.timeLimit}s</span>
              </label>
              <div className="game-settings-form__slider-container">
                <input 
                  type="range" 
                  id="timeLimit" 
                  className="game-settings-form__slider" 
                  min="20" 
                  max="180" 
                  step="10"
                  value={settings.timeLimit}
                  onChange={handleTimeLimitChange}
                />
                <div className="game-settings-form__slider-labels">
                  <span>20s</span>
                  <span>60s</span>
                  <span>180s</span>
                </div>
              </div>
            </div>
            
            <div className="game-settings-form__setting">
              <label className="game-settings-form__label" htmlFor="maxPlayers">
                Maximum Players
                <span className="game-settings-form__value">{settings.maxPlayers}</span>
              </label>
              <div className="game-settings-form__slider-container">
                <input 
                  type="range" 
                  id="maxPlayers" 
                  className="game-settings-form__slider" 
                  min="3" 
                  max="12" 
                  step="1"
                  value={settings.maxPlayers}
                  onChange={handleMaxPlayersChange}
                />
                <div className="game-settings-form__slider-labels">
                  <span>3</span>
                  <span>8</span>
                  <span>12</span>
                </div>
              </div>
            </div>
            
            <div className="game-settings-form__setting">
              <label className="game-settings-form__label">Lobby Privacy</label>
              <div className="game-settings-form__toggle-group">
                <button 
                  className={`game-settings-form__toggle ${settings.isPrivate ? 'game-settings-form__toggle--active' : ''}`}
                  onClick={() => handlePrivacyChange(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Private
                </button>
                <button 
                  className={`game-settings-form__toggle ${!settings.isPrivate ? 'game-settings-form__toggle--active' : ''}`}
                  onClick={() => handlePrivacyChange(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 7h.01"></path>
                    <path d="M12 20H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6.5"></path>
                    <path d="M20.71 16.09a2 2 0 1 0-2.83 2.83l4.24 4.24a2 2 0 0 0 2.83-2.83l-4.24-4.24z"></path>
                  </svg>
                  Public
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-settings-form__advanced-settings">
            <div className="game-settings-form__setting">
              <label className="game-settings-form__label">Difficulty Level</label>
              <div className="game-settings-form__difficulty">
                <button 
                  className={`game-settings-form__difficulty-btn ${settings.difficulty === 'easy' ? 'game-settings-form__difficulty-btn--active' : ''}`}
                  onClick={() => handleDifficultyChange('easy')}
                >
                  Easy
                </button>
                <button 
                  className={`game-settings-form__difficulty-btn ${settings.difficulty === 'medium' ? 'game-settings-form__difficulty-btn--active' : ''}`}
                  onClick={() => handleDifficultyChange('medium')}
                >
                  Medium
                </button>
                <button 
                  className={`game-settings-form__difficulty-btn ${settings.difficulty === 'hard' ? 'game-settings-form__difficulty-btn--active' : ''}`}
                  onClick={() => handleDifficultyChange('hard')}
                >
                  Hard
                </button>
              </div>
            </div>
            
            <div className="game-settings-form__setting">
              <label className="game-settings-form__label">
                Categories
                <span className="game-settings-form__helper">
                  (at least 3 required)
                </span>
              </label>
              <div className="game-settings-form__categories">
                {allCategories.map(category => (
                  <button
                    key={category.id}
                    className={`game-settings-form__category ${settings.categories.includes(category.id) ? 'game-settings-form__category--active' : ''}`}
                    onClick={() => handleCategoryToggle(category.id)}
                    disabled={settings.categories.length <= 3 && settings.categories.includes(category.id)}
                  >
                    {category.label}
                    {settings.categories.includes(category.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSettingsForm;