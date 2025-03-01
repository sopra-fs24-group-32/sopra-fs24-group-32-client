import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaComments } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import './LobbyChat.scss';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

interface LobbyChatProps {
  lobbyCode: string;
}

const LobbyChat: React.FC<LobbyChatProps> = ({ lobbyCode }) => {
  const dispatch = useAppDispatch();
  const lobbyState = useAppSelector(state => state.lobby);
  
  // We'll manage messages within the component since they aren't directly in the store
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  
  // References for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // For a complete implementation, you would get the current user ID from somewhere
  // like a user slice or from session storage. For now, we'll create a fallback.
  const { user } = useAuth();
  const currentUser = user;
  
  // Get current player from the first player for demo purposes
  // In a real implementation, you would map the currentUserId to the matching player
  const currentPlayer = {
    id: currentUser?.id || 'player-1',
    username: lobbyState.players && lobbyState.players.length > 0 
      ? lobbyState.players[0].username 
      : 'You'
  };
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Simulate socket connection effect
  useEffect(() => {
    if (!lobbyCode) return;
    
    // Add system message when joining
    const joinMessage: Message = {
      id: `system-${Date.now()}`,
      userId: 'system',
      username: 'System',
      text: 'You joined the lobby',
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages(prevMessages => [...prevMessages, joinMessage]);
    
    // Mock socket events for demo
    const mockPlayerJoin = (username: string) => {
      const systemMessage: Message = {
        id: `system-player-joined-${Date.now()}`,
        userId: 'system',
        username: 'System',
        text: `${username} joined the lobby`,
        timestamp: Date.now(),
        isSystem: true
      };
      setMessages(prevMessages => [...prevMessages, systemMessage]);
    };
    
    // Simulate other players joining after a delay (for demo purposes)
    const timeout1 = setTimeout(() => mockPlayerJoin('Alex'), 2000);
    const timeout2 = setTimeout(() => mockPlayerJoin('Sam'), 5000);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [lobbyCode]);
  
  // Listen for player changes in the lobby
  useEffect(() => {
    if (!lobbyState.players || !lobbyState.players.length) return;
    
    // This logic would be handled by actual socket events in a real implementation
    const playerNames = lobbyState.players.map(p => p.username).join(', ');
    console.log(`Players in lobby: ${playerNames}`);
    
  }, [lobbyState.players]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Create message object
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: currentPlayer.id,
      username: currentPlayer.username,
      text: messageInput.trim(),
      timestamp: Date.now()
    };
    
    // Add message locally
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // In a real implementation, would send via socket:
    // socket.emit('chat:sendMessage', { lobbyCode, message: newMessage });
    
    // Clear input
    setMessageInput('');
  };
  
  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`lobby-chat ${isExpanded ? 'expanded' : 'collapsed'}`} ref={chatContainerRef}>
      <div className="chat-header" onClick={toggleChat}>
        <h3>
          <FaComments /> Chat
          {!isExpanded && messages.length > 0 && (
            <span className="message-count">{messages.length}</span>
          )}
        </h3>
        <div className="expand-toggle">
          {isExpanded ? '−' : '+'}
        </div>
      </div>
      
      {isExpanded && (
        <>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Be the first to say hello!</p>
              </div>
            ) : (
              messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message-item ${message.isSystem ? 'system-message' : ''} ${message.userId === currentPlayer.id ? 'own-message' : ''}`}
                >
                  {!message.isSystem && (
                    <div className="message-sender">
                      {message.username}:
                    </div>
                  )}
                  
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              maxLength={150}
            />
            
            <button 
              type="submit" 
              className="send-button"
              disabled={!messageInput.trim()}
            >
              <FaPaperPlane />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default LobbyChat;