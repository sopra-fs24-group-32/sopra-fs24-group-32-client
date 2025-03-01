import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLobby } from '../../store/hooks/useLobby';
import LobbyHeader from './LobbyHeader';
import PlayersList from './PlayersList';
import GameSettings from './GameSettings';
import LobbyActions from './LobbyActions';
import LobbyChat from './LobbyChat';
import LoadingSpinner from '../LoadingSpninner/LoadingSpinner';
import './LobbyPage.scss';
import { useAuth } from '../context/AuthContext';

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { lobbyState, isLoading, error, getLobbyDetails, leaveLobby, startGame } = useLobby();
  const { user } = useAuth();
  const currentUser = user;
  const [isHost, setIsHost] = useState(false);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    // Fetch initial lobby details
    if (lobbyState.lobbyCode) {
      getLobbyDetails(lobbyState.lobbyCode).catch(() => {
        navigate('/menu');
      });
    } else {
      navigate('/menu');
    }

    // Set up polling for lobby updates
    const intervalId = setInterval(() => {
      if (lobbyState.lobbyCode) {
        getLobbyDetails(lobbyState.lobbyCode).catch(() => {
          clearInterval(intervalId);
        });
      }
    }, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [lobbyState.lobbyCode]);

  // Check if current user is host
  useEffect(() => {
    if (lobbyState.players && lobbyState.players.length > 0 && currentUser) {
      const hostPlayer = lobbyState.players.find(player => player.isHost);
      setIsHost(hostPlayer?.id === currentUser.id);
    }
  }, [lobbyState.players, currentUser]);

  // Check if game can be started
  useEffect(() => {
    // Game can start if there are at least 3 players (from requirement S21)
    const hasEnoughPlayers = lobbyState.players && lobbyState.players.length >= 3;
    // And if the current user is the host
    setCanStart(isHost && hasEnoughPlayers);
  }, [lobbyState.players, isHost]);

  // Handle leaving the lobby
  const handleLeaveLobby = async () => {
    try {
      await leaveLobby();
      navigate('/menu');
    } catch (error) {
      console.error('Error leaving lobby:', error);
    }
  };

  // Handle starting the game
  const handleStartGame = async () => {
    try {
      await startGame();
      navigate(`/game/${lobbyState.lobbyCode}`);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  if (isLoading && !lobbyState.players) {
    return <LoadingSpinner />;
  }

  return (
    <div className="lobby-page">
      <div className="lobby-container">
        <LobbyHeader 
          lobbyName={lobbyState.lobbyName || 'Game Lobby'} 
          lobbyCode={lobbyState.lobbyCode || ''} 
        />
        
        <div className="lobby-content">
          <div className="lobby-main">
            <PlayersList 
              players={lobbyState.players || []} 
              currentUserId={currentUser?.id} 
              isHost={isHost}
            />
            
            <GameSettings 
              settings={{
                numberOfRounds: lobbyState.numberOfRounds,
                timeLimit: lobbyState.timeLimit,
                maxPlayers: lobbyState.maxPlayers,
                isPrivate: lobbyState.isPrivate,
                difficulty: lobbyState.difficulty,
                gameSettings: lobbyState.gameSettings
              }}
              isEditable={isHost}
            />
          </div>
          
          <LobbyChat lobbyCode={lobbyState.lobbyCode || ''} />
        </div>
        
        <LobbyActions 
          onLeaveLobby={handleLeaveLobby} 
          onStartGame={handleStartGame}
          canStart={canStart}
          isHost={isHost}
        />
      </div>
    </div>
  );
};

export default LobbyPage;