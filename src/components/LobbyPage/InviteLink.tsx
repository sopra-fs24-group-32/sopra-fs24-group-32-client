import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaShareAlt, FaEnvelope } from 'react-icons/fa';
import './InviteLink.scss';

interface InviteLinkProps {
  lobbyCode: string;
}

const InviteLink: React.FC<InviteLinkProps> = ({ lobbyCode }) => {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Generate full invite link
  const getInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/join/${lobbyCode}`;
  };
  
  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(getInviteLink());
    setCopied(true);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Handle share via email
  const handleEmailShare = () => {
    const subject = 'Join my GPTuessr game!';
    const body = `Hey there! I'm inviting you to join my GPTuessr game. Click the link below to join:\n\n${getInviteLink()}\n\nLobby code: ${lobbyCode}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Hide share options after clicking
    setShowShareOptions(false);
  };
  
  // Handle web share API if available
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my GPTuessr game!',
        text: `Join my game with lobby code: ${lobbyCode}`,
        url: getInviteLink()
      })
      .then(() => {
        // Hide share options after sharing
        setShowShareOptions(false);
      })
      .catch(console.error);
    }
  };
  
  // Check if Web Share API is available
  const canNativeShare = !!navigator.share;
  
  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowShareOptions(false);
    };
    
    if (showShareOptions) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showShareOptions]);
  
  return (
    <div className="invite-link">
      <div className="invite-link-container">
        <input
          type="text"
          value={getInviteLink()}
          readOnly
          onClick={(e) => e.target.select()}
        />
        
        <button
          className="copy-button"
          onClick={handleCopyLink}
          aria-label={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? <FaCheck /> : <FaCopy />}
          <span className="tooltip">{copied ? 'Copied!' : 'Copy link'}</span>
        </button>
        
        <div className="share-container">
          <button
            className="share-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareOptions(!showShareOptions);
            }}
            aria-label="Share link"
          >
            <FaShareAlt />
            <span className="tooltip">Share link</span>
          </button>
          
          {showShareOptions && (
            <div className="share-options" onClick={(e) => e.stopPropagation()}>
              {canNativeShare && (
                <button className="share-option" onClick={handleNativeShare}>
                  <FaShareAlt /> Share
                </button>
              )}
              
              <button className="share-option" onClick={handleEmailShare}>
                <FaEnvelope /> Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteLink;