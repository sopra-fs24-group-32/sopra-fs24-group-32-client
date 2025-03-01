import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatingGame.scss';
import { useAuth } from '../context/AuthContext';
import useLobby from "../../store/hooks/useLobby";

const CreatingGame = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createLobby, isLoading, error } = useLobby();
  
  const [formData, setFormData] = useState({
    numberOfRounds: 3,
    timeLimit: 60,
    maxPlayers: 4,
    isPrivate: false,
    difficulty: 'medium',
    gameSettings: ['standard'],
    lobbyName: '',
    password: ''
  });
  
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStage(1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Update local error state when error changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleGameModeChange = (mode) => {
    setFormData(prevData => ({
      ...prevData,
      gameSettings: [mode]
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    
    try {
      // Map frontend form data to API DTO structure
      const lobbyData = {
        lobbyName: formData.lobbyName,
        numberOfRounds: parseInt(formData.numberOfRounds),
        timeLimit: parseInt(formData.timeLimit),
        maxPlayers: parseInt(formData.maxPlayers),
        isPrivate: formData.isPrivate,
        password: formData.isPrivate ? formData.password : undefined,
        difficulty: formData.difficulty,
        gameSettings: [...formData.gameSettings]
      };
      
      // Create the lobby using our custom hook
      const lobbyCode = await createLobby(lobbyData);
      
      // Navigate to the created lobby
      navigate(`/lobby/host/${lobbyCode}`);
    } catch (error) {
      console.error("Error creating lobby:", error);
      
      // Handle authentication errors specially
      if (error.response && error.response.status === 401) {
        navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
        return;
      }
      
      setLocalError(error.message || 'Failed to create lobby');
      setIsSubmitting(false);
    }
  };
  
  const gameModes = [
    { id: 'standard', name: 'Standard Mode', description: 'Classic gameplay with regular rules' },
    { id: 'time-attack', name: 'Time Attack', description: 'Race against the clock for bonus points' },
    { id: 'expert', name: 'Expert Mode', description: 'More challenging prompts and scoring' }
  ];
  
  // Map gameSettings to gameMode for UI
  const currentGameMode = formData.gameSettings[0] || 'standard';
  
  return (
    <div className={`creating-game ${animationStage > 0 ? 'creating-game--visible' : ''}`}>
      <div className="creating-game__container">
        <div className="creating-game__header">
          <h1 className="creating-game__title">Create New Game</h1>
          <p className="creating-game__subtitle">
            Set up your game lobby and invite friends to join your AI art guessing game!
          </p>
        </div>
        
        {localError && (
          <div className="creating-game__error">
            {localError}
          </div>
        )}
        
        <form className="creating-game__form" onSubmit={handleSubmit}>
          <div className="creating-game__section creating-game__section--basic">
            <div className="creating-game__field-group">
              <label className="creating-game__label" htmlFor="lobbyName">
                Lobby Name <span className="creating-game__required">*</span>
              </label>
              <input
                type="text"
                id="lobbyName"
                name="lobbyName"
                className="creating-game__input"
                value={formData.lobbyName}
                onChange={handleChange}
                placeholder="e.g. Fun AI Art Challenge"
                required
                disabled={isSubmitting || isLoading}
              />
            </div>
            
            <div className="creating-game__field-row">
              <div className="creating-game__field-group">
                <label className="creating-game__label" htmlFor="maxPlayers">
                  Maximum Number of Players
                </label>
                <div className="creating-game__number-input">
                  <button
                    type="button"
                    className="creating-game__number-btn"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      maxPlayers: Math.max(2, prev.maxPlayers - 1) 
                    }))}
                    disabled={formData.maxPlayers <= 2 || isSubmitting || isLoading}
                    aria-label="Decrease players"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="maxPlayers"
                    name="maxPlayers"
                    className="creating-game__input creating-game__input--number"
                    value={formData.maxPlayers}
                    onChange={handleChange}
                    min="2"
                    max="8"
                    disabled={isSubmitting || isLoading}
                    aria-label="Maximum players"
                  />
                  <button
                    type="button"
                    className="creating-game__number-btn"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      maxPlayers: Math.min(8, prev.maxPlayers + 1) 
                    }))}
                    disabled={formData.maxPlayers >= 8 || isSubmitting || isLoading}
                    aria-label="Increase players"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="creating-game__field-group">
                <label className="creating-game__label" htmlFor="numberOfRounds">
                  Total Number of Rounds
                </label>
                <div className="creating-game__number-input">
                  <button
                    type="button"
                    className="creating-game__number-btn"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      numberOfRounds: Math.max(1, prev.numberOfRounds - 1) 
                    }))}
                    disabled={formData.numberOfRounds <= 1 || isSubmitting || isLoading}
                    aria-label="Decrease rounds"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="numberOfRounds"
                    name="numberOfRounds"
                    className="creating-game__input creating-game__input--number"
                    value={formData.numberOfRounds}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    disabled={isSubmitting || isLoading}
                    aria-label="Total rounds"
                  />
                  <button
                    type="button"
                    className="creating-game__number-btn"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      numberOfRounds: Math.min(10, prev.numberOfRounds + 1) 
                    }))}
                    disabled={formData.numberOfRounds >= 10 || isSubmitting || isLoading}
                    aria-label="Increase rounds"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="creating-game__field-group">
              <label className="creating-game__label" htmlFor="timeLimit">
                Time Per Round (seconds)
              </label>
              <div className="creating-game__range-wrapper">
                <input
                  type="range"
                  id="timeLimit"
                  name="timeLimit"
                  className="creating-game__range"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  min="30"
                  max="180"
                  step="10"
                  disabled={isSubmitting || isLoading}
                  aria-label="Round time in seconds"
                />
                <div className="creating-game__range-value">
                  {formData.timeLimit} seconds
                </div>
              </div>
            </div>
          </div>
          
          <div className="creating-game__section creating-game__section--game-modes">
            <h2 className="creating-game__section-title">Game Mode Selection</h2>
            <div className="creating-game__game-modes">
              {gameModes.map(mode => (
                <div 
                  key={mode.id}
                  className={`creating-game__game-mode ${currentGameMode === mode.id ? 'creating-game__game-mode--selected' : ''}`}
                  onClick={() => !isSubmitting && !isLoading && handleGameModeChange(mode.id)}
                >
                  <input
                    type="radio"
                    id={`gameMode-${mode.id}`}
                    name="gameMode"
                    value={mode.id}
                    checked={currentGameMode === mode.id}
                    onChange={() => handleGameModeChange(mode.id)}
                    className="creating-game__game-mode-input"
                    disabled={isSubmitting || isLoading}
                  />
                  <div className="creating-game__game-mode-content">
                    <h3 className="creating-game__game-mode-title">{mode.name}</h3>
                    <p className="creating-game__game-mode-description">{mode.description}</p>
                  </div>
                  <div className="creating-game__game-mode-check">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="creating-game__section creating-game__section--privacy">
            <h2 className="creating-game__section-title">Privacy Settings</h2>
            <div className="creating-game__toggle-group">
              <label className="creating-game__toggle" htmlFor="isPrivate">
                <input
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  className="creating-game__toggle-input"
                  disabled={isSubmitting || isLoading}
                />
                <div className="creating-game__toggle-control">
                  <div className="creating-game__toggle-switch"></div>
                </div>
                <span className="creating-game__toggle-label">Private Lobby (Password Required)</span>
              </label>
              
              {formData.isPrivate && (
                <div className="creating-game__field-group creating-game__field-group--password">
                  <label className="creating-game__label" htmlFor="password">
                    Lobby Password <span className="creating-game__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    className="creating-game__input"
                    value={formData.password || ''}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    required={formData.isPrivate}
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="creating-game__actions">
            <button 
              type="button" 
              className="creating-game__button creating-game__button--secondary"
              onClick={() => navigate('/home')}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`creating-game__button creating-game__button--primary ${(isSubmitting || isLoading) ? 'creating-game__button--loading' : ''}`}
              disabled={isSubmitting || isLoading}
            >
              {(isSubmitting || isLoading) ? (
                <>
                  <span className="creating-game__spinner"></span>
                  <span>Creating Game...</span>
                </>
              ) : (
                <span>Create Game</span>
              )}
            </button>
          </div>
        </form>
        
        <div className="creating-game__decoration creating-game__decoration--1"></div>
        <div className="creating-game__decoration creating-game__decoration--2"></div>
      </div>
    </div>
  );
};

export default CreatingGame;