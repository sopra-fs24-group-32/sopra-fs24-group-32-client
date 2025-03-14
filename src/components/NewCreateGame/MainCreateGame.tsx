import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateGame, { GameSettings } from './CreateGame';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch } from '../../store/hooks';
import './MainCreateGame.scss';

/**
 * MainCreateGame serves as a container for the CreateGame component,
 * handling the integration with Redux, routing, and API interactions
 */
const MainCreateGame: React.FC = () => {
  const { clerkUser } = useAuth();
  const username = clerkUser?.username || clerkUser?.firstName || 'Guest';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle game creation and navigate to the lobby
   */
  const handleCreateGame = useCallback(async (settings: GameSettings) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get authentication token
      const token = await clerkUser?.getToken();
      
      if (!token) {
        throw new Error('Authentication token not available');
      }

      // Prepare the game creation request
      const gameConfig = {
        lobbyName: settings.lobbyName,
        rounds: settings.rounds,
        timeLimit: settings.timeLimit,
        maxPlayers: settings.maxPlayers,
        isPrivate: settings.isPrivate,
        customPrompts: settings.customPrompts.length > 0 ? settings.customPrompts : undefined,
        hostId: clerkUser?.id
      };

      // API call would go here
      console.log('Creating game with config:', gameConfig);
      
      // Simulate API call for demonstration
      // In a real implementation, you would use a thunk or similar pattern
      // dispatch(createGameThunk(gameConfig, token));
      
      // Simulate server response
      setTimeout(() => {
        // Once game is created, redirect to the lobby page with the game ID
        const mockGameId = 'game_' + Math.random().toString(36).substring(2, 10);
        navigate(`/lobby/waiting-room/${mockGameId}`);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to create game:', err);
      setError(err instanceof Error ? err.message : 'Failed to create game. Please try again.');
      setIsLoading(false);
    }
  }, [clerkUser, navigate]);

  /**
   * Handle cancellation and navigate back to home
   */
  const handleCancel = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  return (
    <div className="main-create-game">
      {error && (
        <div className="main-create-game__error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {isLoading ? (
        <div className="main-create-game__loading">
          <div className="spinner"></div>
          <p>Creating your game...</p>
        </div>
      ) : (
        <CreateGame
          username={username}
          onCreateGame={handleCreateGame}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default MainCreateGame;