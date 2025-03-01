import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useLobby } from '../../store/hooks/useLobby';
import './ReadyStatusToggle.scss';

interface ReadyStatusToggleProps {
  isReady: boolean;
  playerId: string;
  disabled?: boolean;
}

const ReadyStatusToggle: React.FC<ReadyStatusToggleProps> = ({
  isReady,
  playerId,
  disabled = false
}) => {
  const { updatePlayerReady } = useLobby();
  
  const handleToggle = () => {
    if (disabled) return;
    updatePlayerReady(playerId, !isReady);
  };
  
  return (
    <button
      className={`ready-toggle ${isReady ? 'is-ready' : 'not-ready'} ${disabled ? 'disabled' : ''}`}
      onClick={handleToggle}
      disabled={disabled}
      aria-label={isReady ? 'Set to not ready' : 'Set to ready'}
      title={isReady ? 'Set to not ready' : 'Set to ready'}
    >
      {isReady ? (
        <>
          <span className="icon">
            <FaCheckCircle />
          </span>
          <span className="text">Ready</span>
        </>
      ) : (
        <>
          <span className="icon">
            <FaTimesCircle />
          </span>
          <span className="text">Not Ready</span>
        </>
      )}
    </button>
  );
};

export default ReadyStatusToggle;