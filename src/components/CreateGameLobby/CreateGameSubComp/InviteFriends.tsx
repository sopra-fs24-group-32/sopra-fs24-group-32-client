import React, { useState } from 'react';
import './InviteFriends.scss';

interface InviteFriendsProps {
  lobbyCode: string;
  onAddMockPlayer: () => void; // For demo purposes
}

const InviteFriends: React.FC<InviteFriendsProps> = ({ lobbyCode, onAddMockPlayer }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  
  // Demo link to share
  const inviteLink = `${window.location.origin}/lobby/join/${lobbyCode}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send an email invite
    // For this demo, we'll just simulate a successful invite
    setInviteSent(true);
    setEmail('');
    
    // Add a mock player for demonstration (after a delay)
    setTimeout(() => {
      onAddMockPlayer();
      setInviteSent(false);
    }, 1500);
  };
  
  return (
    <div className="invite-friends">
      <h2 className="invite-friends__title">Invite Friends</h2>
      
      <div className="invite-friends__methods">
        <div className="invite-friends__method">
          <h3 className="invite-friends__method-title">Share Link</h3>
          <div className="invite-friends__link-container">
            <div className="invite-friends__link">{inviteLink}</div>
            <button 
              className={`invite-friends__copy-btn ${copied ? 'invite-friends__copy-btn--copied' : ''}`}
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          
          <div className="invite-friends__share-buttons">
            <button className="invite-friends__share-btn invite-friends__share-btn--whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
            <button className="invite-friends__share-btn invite-friends__share-btn--telegram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
            <button className="invite-friends__share-btn invite-friends__share-btn--discord">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="invite-friends__divider">
          <span>or</span>
        </div>
        
        <div className="invite-friends__method">
          <h3 className="invite-friends__method-title">Email Invite</h3>
          <form className="invite-friends__email-form" onSubmit={handleSendInvite}>
            <div className="invite-friends__form-group">
              <input 
                type="email" 
                className="invite-friends__email-input" 
                placeholder="friend@example.com" 
                value={email}
                onChange={handleEmailChange}
                required
              />
              <button 
                type="submit" 
                className="invite-friends__send-btn"
                disabled={inviteSent || !email}
              >
                {inviteSent ? (
                  <>
                    <svg className="invite-friends__spinner" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Temporary: Mock Player Button (for demonstration purposes) */}
      <button 
        className="invite-friends__demo-btn" 
        onClick={onAddMockPlayer}
        title="This button is just for demo purposes"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
        Add Mock Player (Demo Only)
      </button>
    </div>
  );
};

export default InviteFriends;