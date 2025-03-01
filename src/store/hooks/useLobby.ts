import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { socketActions } from "../index";
import { 
  setLobbyDetails, 
  addPlayer, 
  removePlayer, 
  setLobbyCode, 
  updatePlayerReadyStatus, 
  resetLobby 
} from '../../store/slices/lobbySlice';
import LobbyService from '../../services/lobbyService';

export const useLobby = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const lobbyState = useAppSelector(state => state.lobby);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new lobby
  const createLobby = useCallback(async (lobbyData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create lobby via API
      const response = await LobbyService.createLobby(lobbyData);
      
      // Store lobby details in Redux
      dispatch(setLobbyDetails({
        lobbyName: lobbyData.lobbyName || 'New Game',
        numberOfRounds: lobbyData.numberOfRounds,
        timeLimit: lobbyData.timeLimit,
        maxPlayers: lobbyData.maxPlayers,
        isPrivate: lobbyData.isPrivate,
        difficulty: lobbyData.difficulty,
        gameSettings: lobbyData.gameSettings
      }));
      
      // Set lobby code
      dispatch(setLobbyCode(response.lobbyCode));
      
      // Connect to WebSocket for real-time updates
      if (response.token) {
        dispatch(socketActions.connect(response.token));
        dispatch(socketActions.joinLobby(response.lobbyCode));
      }
      
      setIsLoading(false);
      return response.lobbyCode;
    } catch (err) {
      console.error('Error creating lobby:', err);
      setError(err.message || 'Failed to create lobby');
      setIsLoading(false);
      throw err;
    }
  }, [dispatch]);

  // Join an existing lobby
  const joinLobby = useCallback(async (lobbyCode, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Join lobby via API
      const response = await LobbyService.joinLobby({ lobbyCode, password });
      
      // Store lobby details in Redux
      dispatch(setLobbyDetails({
        lobbyName: response.lobbyName || 'Game Lobby',
        numberOfRounds: response.numberOfRounds,
        timeLimit: response.timeLimit,
        maxPlayers: response.maxPlayers,
        isPrivate: response.isPrivate,
        difficulty: response.difficulty,
        gameSettings: response.gameSettings
      }));
      
      // Set lobby code
      dispatch(setLobbyCode(lobbyCode));
      
      // Add existing players to the lobby
      if (response.players) {
        response.players.forEach(player => {
          dispatch(addPlayer(player));
        });
      }
      
      // Connect to WebSocket for real-time updates
      if (response.token) {
        dispatch(socketActions.connect(response.token));
        dispatch(socketActions.joinLobby(lobbyCode, password));
      }
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error joining lobby:', err);
      setError(err.message || 'Failed to join lobby');
      setIsLoading(false);
      throw err;
    }
  }, [dispatch]);

  // Get lobby details
  const getLobbyDetails = useCallback(async (lobbyCode) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get lobby details via API
      const response = await LobbyService.getLobbyDetails(lobbyCode);
      
      // Store lobby details in Redux
      dispatch(setLobbyDetails({
        lobbyName: response.lobbyName || 'Game Lobby',
        numberOfRounds: response.numberOfRounds,
        timeLimit: response.timeLimit,
        maxPlayers: response.maxPlayers,
        isPrivate: response.isPrivate,
        difficulty: response.difficulty,
        gameSettings: response.gameSettings
      }));
      
      // Update player list
      if (response.players) {
        // First reset existing players to avoid duplicates
        dispatch(resetLobby());
        dispatch(setLobbyCode(lobbyCode));
        
        // Then add current players
        response.players.forEach(player => {
          dispatch(addPlayer(player));
        });
      }
      
      setIsLoading(false);
      return response;
    } catch (err) {
      console.error('Error fetching lobby details:', err);
      setError(err.message || 'Failed to get lobby details');
      setIsLoading(false);
      throw err;
    }
  }, [dispatch]);

  // Leave the current lobby
  const leaveLobby = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (lobbyState.lobbyCode) {
        // Notify server that user is leaving
        await LobbyService.leaveLobby(lobbyState.lobbyCode);
        
        // Disconnect from WebSocket
        dispatch(socketActions.leaveLobby(lobbyState.lobbyCode));
        dispatch(socketActions.disconnect());
      }
      
      // Reset lobby state
      dispatch(resetLobby());
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error leaving lobby:', err);
      setIsLoading(false);
      // Still reset local state even if API call fails
      dispatch(resetLobby());
      return false;
    }
  }, [dispatch, lobbyState.lobbyCode]);

  // Update lobby settings
  const updateLobbySettings = useCallback(async (settings) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update lobby settings in Redux
      dispatch(setLobbyDetails({
        ...lobbyState,
        ...settings
      }));
      
      // Notify WebSocket of settings change
      if (lobbyState.lobbyCode) {
        dispatch(socketActions.updateSettings(lobbyState.lobbyCode, settings));
      }
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error updating lobby settings:', err);
      setError(err.message || 'Failed to update lobby settings');
      setIsLoading(false);
      return false;
    }
  }, [dispatch, lobbyState]);

  // Start the game
  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!lobbyState.lobbyCode) {
        throw new Error('No active lobby');
      }
      
      // Start game via API
      await LobbyService.startGame(lobbyState.lobbyCode);
      
      // Notify WebSocket that game is starting
      dispatch(socketActions.startGame(lobbyState.lobbyCode));
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error starting game:', err);
      setError(err.message || 'Failed to start game');
      setIsLoading(false);
      return false;
    }
  }, [dispatch, lobbyState.lobbyCode]);

  // Kick a player from the lobby
  const kickPlayer = useCallback((playerId) => {
    // In a real app, you'd make an API call here
    dispatch(removePlayer(playerId));
  }, [dispatch]);

  // Update a player's ready status
  const updatePlayerReady = useCallback((playerId, isReady) => {
    dispatch(updatePlayerReadyStatus({ playerId, isReady }));
  }, [dispatch]);

  return {
    lobbyState,
    isLoading,
    error,
    createLobby,
    joinLobby,
    getLobbyDetails,
    leaveLobby,
    updateLobbySettings,
    startGame,
    kickPlayer,
    updatePlayerReady
  };
};

export default useLobby;