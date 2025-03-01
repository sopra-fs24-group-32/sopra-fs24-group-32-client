import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LobbyHeader from './CreateGameSubComp/LobbyHeader';
import GameSettingsForm from './CreateGameSubComp/GameSettingsForm';
import PlayerList from './CreateGameSubComp/PlayerList';
import InviteFriends from './CreateGameSubComp/InviteFriends';
import LobbyActions from './CreateGameSubComp/LobbyActions';
import './CreateGameLobby.scss';
import useLobby from "../../store/hooks/useLobby";

const CreateGameLobby: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { lobbyCode } = useParams<{ lobbyCode: string }>();
  
  const { 
    lobbyState,
    isLoading: isLobbyLoading,
    error: lobbyError,
    joinLobby,
    getLobbyDetails,
    leaveLobby,
    updateLobbySettings,
    startGame,
    kickPlayer,
    updatePlayerReady
  } = useLobby();
  
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigatingAway = useRef(false);
  
  // Handle beforeunload event
  const handleBeforeUnload = useCallback((e) => {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? The game lobby will be closed.';
    return 'Are you sure you want to leave? The game lobby will be closed.';
  }, []);

  // Set up the beforeunload event listener when component mounts
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // If we're intentionally navigating away, don't clean up the lobby
      if (!navigatingAway.current && lobbyCode) {
        leaveLobby();
      }
    };
  }, [handleBeforeUnload, lobbyCode, leaveLobby]);

  // Handle browser history navigation (back button)
  const location = useLocation();
  
  useEffect(() => {
    // Create a custom history blocker
    const unblock = window.history.pushState(null, '', location.pathname);
    
    const handlePopState = (event) => {
      if (!navigatingAway.current) {
        event.preventDefault();
        
        const confirmed = window.confirm('Are you sure you want to leave? The game lobby will be closed.');
        
        if (confirmed) {
          navigatingAway.current = true;
          
          if (lobbyCode) {
            leaveLobby();
          }
          
          navigate('/home');
        } else {
          window.history.pushState(null, '', location.pathname);
        }
      }
    };
    
    // Add popstate event listener for back button
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, navigate, lobbyCode, leaveLobby]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    const joinExistingLobby = async () => {
      if (lobbyCode && lobbyCode !== lobbyState.lobbyCode) {
        try {
          setLocalError('');
          await joinLobby(lobbyCode);
        } catch (error) {
          console.error('Error joining lobby:', error);
          setLocalError('Failed to join lobby. It may no longer exist.');
          
          setTimeout(() => {
            navigate('/home');
          }, 3000);
        }
      }
    };
    
    joinExistingLobby();
  }, [lobbyCode, lobbyState.lobbyCode, joinLobby, navigate]);

  // Refresh lobby details periodically or when needed
  const refreshLobbyDetails = useCallback(async () => {
    if (lobbyCode) {
      setIsRefreshing(true);
      try {
        await getLobbyDetails(lobbyCode);
        setLocalError('');
      } catch (error) {
        console.error('Error refreshing lobby details:', error);
        setLocalError('Failed to refresh lobby details');
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [lobbyCode, getLobbyDetails]);

  // Initial lobby details fetch
  useEffect(() => {
    if (lobbyCode && lobbyState.lobbyCode) {
      refreshLobbyDetails();
    }
  }, [lobbyCode, lobbyState.lobbyCode, refreshLobbyDetails]);

  // Set up periodic refresh (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (lobbyCode && lobbyState.lobbyCode) {
        refreshLobbyDetails();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [lobbyCode, lobbyState.lobbyCode, refreshLobbyDetails]);

  // Update local error when lobby error changes
  useEffect(() => {
    if (lobbyError) {
      setLocalError(lobbyError);
    }
  }, [lobbyError]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSettingsChange = async (newSettings) => {
    setIsSaving(true);
    
    try {
      await updateLobbySettings(newSettings);
      setIsSaving(false);
      
      await refreshLobbyDetails();
    } catch (error) {
      console.error('Error updating settings:', error);
      setLocalError('Failed to update game settings');
      setIsSaving(false);
    }
  };

  const handleAddMockPlayer = () => {
    if (lobbyState.players.length >= lobbyState.maxPlayers) {
      setLocalError('Maximum player limit reached');
      setTimeout(() => setLocalError(''), 3000);
      return;
    }
    
    // Refresh lobby details after player joins
    setTimeout(() => refreshLobbyDetails(), 500);
  };

  // Handle kick player
  const handleKickPlayer = (playerId) => {
    kickPlayer(playerId);
    
    // Refresh lobby details after player is kicked
    setTimeout(() => refreshLobbyDetails(), 500);
  };

  // Start the game
  const handleStartGame = async () => {
    // Check if there are enough players
    if (lobbyState.players.length < 3) {
      setLocalError('At least 3 players are required to start the game');
      setTimeout(() => setLocalError(''), 3000);
      return;
    }

    // Check if all players are ready
    if (!lobbyState.players.every(player => player.isReady)) {
      setLocalError('All players must be ready to start the game');
      setTimeout(() => setLocalError(''), 3000);
      return;
    }

    try {
      setIsSaving(true);
      await startGame();
      setIsSaving(false);
      
      // Navigate to the game with the lobby code
      navigate(`/game/${lobbyState.lobbyCode}`);
    } catch (error) {
      console.error('Error starting game:', error);
      setLocalError('Failed to start the game');
      setIsSaving(false);
    }
  };

  // Cancel and return to home with confirmation
  const handleCancel = () => {
    const confirmLeave = window.confirm('Are you sure you want to leave? The game lobby will be closed.');
    if (confirmLeave) {
      navigatingAway.current = true;
      
      leaveLobby();
      
      navigate('/home');
    }
  };

  // Find current user in players list
  const currentUser = lobbyState.players.find(player => 
    user && player.id === user.id
  );
  
  // Determine if current user is host
  const isHost = currentUser?.isHost || false;

  if (isLobbyLoading) {
    return (
      <div className="create-game-lobby__loading">
        <div className="loading-spinner"></div>
        <p>Loading lobby...</p>
      </div>
    );
  }

  return (
    <div className={`create-game-lobby ${isPageLoaded ? 'create-game-lobby--loaded' : ''}`}>
      <div className="create-game-lobby__container">
        <LobbyHeader 
          lobbyCode={lobbyState.lobbyCode} 
          playerCount={lobbyState.players.length} 
          maxPlayers={lobbyState.maxPlayers} 
          lobbyName={lobbyState.lobbyName}
        />
        
        {localError && (
          <div className="create-game-lobby__error">
            {localError}
          </div>
        )}
        
        <div className="create-game-lobby__content">
          <div className="create-game-lobby__main">
            <GameSettingsForm 
              settings={{
                rounds: lobbyState.numberOfRounds,
                timeLimit: lobbyState.timeLimit,
                maxPlayers: lobbyState.maxPlayers,
                isPrivate: lobbyState.isPrivate,
                difficulty: lobbyState.difficulty,
                gameSettings: lobbyState.gameSettings
              }} 
              onSettingsChange={handleSettingsChange}
              isHost={isHost}
              isDisabled={isSaving || isRefreshing}
            />
            
            <PlayerList 
              players={lobbyState.players} 
              onKickPlayer={handleKickPlayer} 
              isHost={isHost} 
              currentUserId={user?.id} 
            />
          </div>
          
          <div className="create-game-lobby__sidebar">
            <InviteFriends 
              lobbyCode={lobbyState.lobbyCode} 
              onAddMockPlayer={handleAddMockPlayer}
            />
            
            <LobbyActions 
              onStartGame={handleStartGame} 
              onCancel={handleCancel}
              isStartDisabled={
                lobbyState.players.length < 3 || 
                !lobbyState.players.every(player => player.isReady) ||
                !isHost ||
                isRefreshing
              }
              playerCount={lobbyState.players.length}
              isSaving={isSaving || isRefreshing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGameLobby;