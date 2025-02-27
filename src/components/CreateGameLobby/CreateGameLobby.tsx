import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LobbyHeader from './CreateGameSubComp/LobbyHeader';
import GameSettingsForm from './CreateGameSubComp/GameSettingsForm';
import PlayerList from './CreateGameSubComp/PlayerList';
import InviteFriends from './CreateGameSubComp/InviteFriends';
import LobbyActions from './CreateGameSubComp/LobbyActions';
import './CreateGameLobby.scss';

// Default game settings
const defaultSettings = {
  rounds: 3,
  timeLimit: 60,
  maxPlayers: 8,
  isPrivate: true,
  difficulty: 'medium',
  categories: ['animals', 'nature', 'food', 'travel', 'sports']
};

const CreateGameLobby: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [gameSettings, setGameSettings] = useState(defaultSettings);
  const [lobbyCode, setLobbyCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Mock players (in a real app, this would come from a WebSocket connection)
  const [players, setPlayers] = useState([
    { id: 1, username: user?.username || 'You', isHost: true, isReady: true, avatarUrl: user?.profilePicture || 'https://i.pravatar.cc/150?img=1' },
  ]);

  // Handle beforeunload event
  const handleBeforeUnload = useCallback((e) => {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = 'Are you sure you want to leave? The game lobby will be closed.';
    // Return message for older browsers
    return 'Are you sure you want to leave? The game lobby will be closed.';
  }, []);

  // Set up the beforeunload event listener when component mounts
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // Handle browser history navigation (back button)
  const location = useLocation();
  const navigatingAway = useRef(false);
  
  useEffect(() => {
    // Create a custom history blocker
    const unblock = window.history.pushState(null, '', location.pathname);
    
    const handlePopState = (event) => {
      // This runs when the back button is pressed
      if (!navigatingAway.current) {
        // Prevent the default navigation
        event.preventDefault();
        
        // Ask for confirmation
        const confirmed = window.confirm('Are you sure you want to leave? The game lobby will be closed.');
        
        if (confirmed) {
          navigatingAway.current = true;
          // In a real app, you would notify the server to close the lobby here
          navigate('/home'); // Navigate to home or wherever they were going
        } else {
          // If they cancel, push the current URL back into history to maintain the current page
          window.history.pushState(null, '', location.pathname);
        }
      }
    };
    
    // Add popstate event listener for back button
    window.addEventListener('popstate', handlePopState);
    
    // This function gets called when the component will unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Here you might want to do cleanup, like notifying the server to close the lobby
      // In a real app, you would make an API call to close the lobby
      console.log('Lobby component unmounting, lobby being closed');
    };
  }, [location, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Animation trigger after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    // Generate a random lobby code
    setLobbyCode(generateLobbyCode());
    
    return () => clearTimeout(timer);
  }, []);

  // Function to generate a random lobby code
  const generateLobbyCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Handle settings changes
  const handleSettingsChange = (newSettings: any) => {
    setGameSettings({ ...gameSettings, ...newSettings });
  };

  // Add a mock player (for demo purposes)
  const addMockPlayer = () => {
    if (players.length >= gameSettings.maxPlayers) {
      setError('Maximum player limit reached');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    const mockNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const newPlayer = {
      id: players.length + 1,
      username: randomName,
      isHost: false,
      isReady: Math.random() > 0.3, // Randomly set ready status
      avatarUrl: `https://i.pravatar.cc/150?img=${players.length + 5}`
    };
    
    setPlayers([...players, newPlayer]);
  };

  // Remove a player from the lobby
  const handleKickPlayer = (playerId: number) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  // Start the game
  const handleStartGame = () => {
    // Check if there are enough players
    if (players.length < 3) {
      setError('At least 3 players are required to start the game');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check if all players are ready
    if (!players.every(player => player.isReady)) {
      setError('All players must be ready to start the game');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // In a real app, you would initialize the game on the server
    // For now, we'll just navigate to a game route
    navigate(`/game/${lobbyCode}`);
  };

  // Cancel and return to home with confirmation
  const handleCancel = () => {
    const confirmLeave = window.confirm('Are you sure you want to leave? The game lobby will be closed.');
    if (confirmLeave) {
      // In a real app, you would notify the server to close the lobby here
      navigate('/home');
    }
  };

  if (isLoading) {
    return (
      <div className="create-game-lobby__loading">
        <div className="loading-spinner"></div>
        <p>Loading lobby creation...</p>
      </div>
    );
  }

  return (
    <div className={`create-game-lobby ${isPageLoaded ? 'create-game-lobby--loaded' : ''}`}>
      <div className="create-game-lobby__container">
        <LobbyHeader 
          lobbyCode={lobbyCode} 
          playerCount={players.length} 
          maxPlayers={gameSettings.maxPlayers} 
        />
        
        {error && <div className="create-game-lobby__error">{error}</div>}
        
        <div className="create-game-lobby__content">
          <div className="create-game-lobby__main">
            <GameSettingsForm 
              settings={gameSettings} 
              onSettingsChange={handleSettingsChange} 
            />
            <PlayerList 
              players={players} 
              onKickPlayer={handleKickPlayer} 
              isHost={true} 
              currentUserId={1} // Mock current user ID
            />
          </div>
          
          <div className="create-game-lobby__sidebar">
            <InviteFriends 
              lobbyCode={lobbyCode} 
              onAddMockPlayer={addMockPlayer} // Just for demo purposes
            />
            <LobbyActions 
              onStartGame={handleStartGame} 
              onCancel={handleCancel}
              isStartDisabled={players.length < 3 || !players.every(player => player.isReady)}
              playerCount={players.length}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGameLobby;