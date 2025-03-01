import React from 'react';
import { FaPlay, FaDoorOpen } from 'react-icons/fa';
import './LobbyActions.scss';

interface LobbyActionsProps {
  onLeaveLobby: () => void;
  onStartGame: () => void;
  canStart: boolean;
  isHost: boolean;
}

const LobbyActions: React.FC<LobbyActionsProps> = ({ 
  onLeaveLobby, 
  onStartGame, 
  canStart,
  isHost
}) => {
  return (
    <div className="lobby-actions">
      <button 
        className="leave-button" 
        onClick={onLeaveLobby}
      >
        <FaDoorOpen /> Leave Lobby
      </button>
      
      {isHost && (
        <button 
          className={`start-button ${!canStart ? 'disabled' : ''}`} 
          onClick={onStartGame}
          disabled={!canStart}
        >
          <FaPlay /> Start Game
          {!canStart && <span className="tooltip">Need at least 3 players to start</span>}
        </button>
      )}
    </div>
  );
};

export default LobbyActions;