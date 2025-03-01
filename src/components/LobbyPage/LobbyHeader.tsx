import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import './LobbyHeader.scss';

interface LobbyHeaderProps {
  lobbyName: string;
  lobbyCode: string;
}

const LobbyHeader: React.FC<LobbyHeaderProps> = ({ lobbyName, lobbyCode }) => {
  const [copied, setCopied] = useState(false);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
   
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="lobby-header">
      <h1 className="lobby-title">{lobbyName}</h1>
     
      <div className="lobby-code-container">
        <div className="lobby-code-label">Invite Code:</div>
        <div className="lobby-code">{lobbyCode}</div>
        <button
          className="copy-button"
          onClick={copyCodeToClipboard}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <span className="icon-success">
              <FaCheck />
            </span>
          ) : (
            <FaCopy />
          )}
          <span className="tooltip">{copied ? 'Copied!' : 'Copy code'}</span>
        </button>
      </div>
    </div>
  );
};

export default LobbyHeader;