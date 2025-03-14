import React, { useState, FC, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import lobbyService from '../../services/lobbyService';
import { setLobbyCode } from '../../store/slices/lobbySlice';
import './JoinLobby.scss';

interface JoinLobbyProps {
  navigateToHome?: () => void; // Optional since we'll be using useNavigate
}

// Emojis that will animate around the form
const FLOATING_EMOJIS = ['🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎤', '🏆', '🎁', '✨'];

const JoinLobby: FC<JoinLobbyProps> = ({ navigateToHome }) => {
  const [lobbyId, setLobbyId] = useState<string>('');
  const [lobbyUrl, setLobbyUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animateInput, setAnimateInput] = useState<boolean>(false);
  const [animateUrlInput, setAnimateUrlInput] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(true);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Create emoji elements with random positions and animation parameters
  useEffect(() => {
    const container = document.querySelector('.join-lobby');
    if (!container) return;

    // Remove any existing emoji elements
    const existingEmojis = container.querySelectorAll('.floating-emoji');
    existingEmojis.forEach(emoji => emoji.remove());

    // Create new emoji elements
    FLOATING_EMOJIS.forEach((emoji, index) => {
      const emojiElement = document.createElement('div');
      emojiElement.className = 'floating-emoji';
      emojiElement.textContent = emoji;
      
      // Set random position, delay, duration, and size properties
      const angle = (index / FLOATING_EMOJIS.length) * 360;
      const radius = Math.floor(Math.random() * 100) + 200; // Random radius between 200-300px
      const delay = Math.random() * 5; // Random delay 0-5s
      const duration = Math.random() * 15 + 15; // Random duration 15-30s
      const size = Math.random() * 1 + 1.5; // Random size 1.5-2.5em
      
      emojiElement.style.setProperty('--angle', `${angle}deg`);
      emojiElement.style.setProperty('--radius', `${radius}px`);
      emojiElement.style.setProperty('--delay', `${delay}s`);
      emojiElement.style.setProperty('--duration', `${duration}s`);
      emojiElement.style.setProperty('--size', `${size}em`);
      
      container.appendChild(emojiElement);
    });
    
    // Equalize heights of form and tips cards
    const equalizeHeights = () => {
      const formCard = document.querySelector('.join-lobby__card');
      const tipsCard = document.querySelector('.join-lobby__tips-card');
      
      if (formCard && tipsCard && window.innerWidth >= 992) { // Only on desktop (lg breakpoint)
        // Reset heights first
        formCard.setAttribute('style', '');
        tipsCard.setAttribute('style', '');
        
        // Get heights
        const formHeight = formCard.clientHeight;
        const tipsHeight = tipsCard.clientHeight;
        
        // Set the shorter one to match the taller one
        if (formHeight > tipsHeight) {
          tipsCard.setAttribute('style', `min-height: ${formHeight}px`);
        } else if (tipsHeight > formHeight) {
          formCard.setAttribute('style', `min-height: ${tipsHeight}px`);
        }
      }
    };
    
    // Run on mount and on window resize
    equalizeHeights();
    window.addEventListener('resize', equalizeHeights);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', equalizeHeights);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLobbyId(e.target.value);
    setError('');
  };
  
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLobbyUrl(e.target.value);
    setUrlError('');
  };
  
  const handleJoinWithUrl = async () => {
    if (!lobbyUrl.trim()) {
      setAnimateUrlInput(true);
      setUrlError('Please enter a lobby URL');
      setTimeout(() => setAnimateUrlInput(false), 600);
      return;
    }
    
    // Simple URL validation
    if (!lobbyUrl.startsWith('http://') && !lobbyUrl.startsWith('https://')) {
      setUrlError('Please enter a valid URL (starting with http:// or https://)');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Extract lobby ID from URL (this is a simplistic example)
      // In a real app, you'd use URL parsing to extract the ID properly
      const urlParts = lobbyUrl.split('/');
      const extractedId = urlParts[urlParts.length - 1];
      
      if (!extractedId) {
        throw new Error('Could not extract lobby ID from URL');
      }
      
      await joinLobbyWithCode(extractedId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join lobby. Please check the URL and try again.';
      setUrlError(errorMessage);
      setIsLoading(false);
    }
  };

  const joinLobbyWithCode = async (code: string) => {
    try {
      // Call the backend service to join the lobby
      const response = await lobbyService.joinLobby({ lobbyCode: code });
      
      // Set the lobby code in Redux store
      dispatch(setLobbyCode(code));
      
      // Connect to WebSocket for the lobby
      dispatch({ type: 'SOCKET_JOIN_LOBBY', payload: { lobbyCode: code } });
      
      // Navigate to the lobby page
      navigate(`/lobby/waiting-room/${code}`);
      
      return true;
    } catch (error) {
      // Handle the error and return false to indicate failure
      const errorMessage = error instanceof Error ? error.message : 'Failed to join lobby. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    if (!lobbyId.trim()) {
      setAnimateInput(true);
      setError('Please enter a lobby ID');
      setTimeout(() => setAnimateInput(false), 600);
      return;
    }
    
    setIsLoading(true);
   
    try {
      await joinLobbyWithCode(lobbyId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join lobby. Please check the ID and try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleNavigateToHome = () => {
    if (navigateToHome) {
      navigateToHome();
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="join-lobby">
      <div className="join-lobby__content">
        <div className="join-lobby__container">
          <div className="join-lobby__card">
            <h1 className="join-lobby__title">Join a Game</h1>
            <p className="join-lobby__subtitle">Enter the lobby ID or URL shared by your friends</p>
           
            <form className="join-lobby__form" onSubmit={handleSubmit}>
              <div className="join-lobby__input-group">
                <label htmlFor="lobbyId" className="join-lobby__label">Lobby ID</label>
                <div className="join-lobby__input-wrapper">
                  <span className="join-lobby__input-icon">🔑</span>
                  <input
                    type="text"
                    id="lobbyId"
                    className={`join-lobby__input ${animateInput ? 'join-lobby__input--shake' : ''} ${error ? 'join-lobby__input--error' : ''}`}
                    placeholder="e.g. GAME123"
                    value={lobbyId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="join-lobby__error"><span>⚠️</span> {error}</p>}
              </div>
             
              <div className="join-lobby__actions">
                <button
                  type="submit"
                  className="join-lobby__button join-lobby__button--primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="join-lobby__loading">
                      <span className="join-lobby__loading-dot"></span>
                      <span className="join-lobby__loading-dot"></span>
                      <span className="join-lobby__loading-dot"></span>
                    </span>
                  ) : (
                    <>
                      <span className="join-lobby__button-icon">🚀</span>
                      <span>Join with ID</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="join-lobby__button join-lobby__button--secondary"
                  onClick={handleNavigateToHome}
                  disabled={isLoading}
                >
                  <span className="join-lobby__button-icon">🏠</span>
                  <span>Back to Home</span>
                </button>
              </div>
              
              <div className="join-lobby__divider">
                <span className="join-lobby__divider-text">Or</span>
              </div>
              
              <div className="join-lobby__input-group">
                <label htmlFor="lobbyUrl" className="join-lobby__label">Join with URL</label>
                <div className="join-lobby__input-wrapper">
                  <span className="join-lobby__input-icon">🔗</span>
                  <input
                    type="url"
                    id="lobbyUrl"
                    className={`join-lobby__input ${animateUrlInput ? 'join-lobby__input--shake' : ''} ${urlError ? 'join-lobby__input--error' : ''}`}
                    placeholder="Paste the invitation link here"
                    value={lobbyUrl}
                    onChange={handleUrlInputChange}
                    disabled={isLoading}
                  />
                </div>
                <p className="join-lobby__hint">Paste the complete URL you received from your friends</p>
                {urlError && <p className="join-lobby__error"><span>⚠️</span> {urlError}</p>}
              </div>
              
              <button
                type="button"
                className="join-lobby__button join-lobby__button--url"
                onClick={handleJoinWithUrl}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="join-lobby__loading">
                    <span className="join-lobby__loading-dot"></span>
                    <span className="join-lobby__loading-dot"></span>
                    <span className="join-lobby__loading-dot"></span>
                  </span>
                ) : (
                  <>
                    <span className="join-lobby__button-icon">🌐</span>
                    <span>Join via URL</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className={`join-lobby__tips-container ${showTips ? 'join-lobby__tips-container--visible' : ''}`}>
          <div className="join-lobby__tips-card">
            <div className="join-lobby__tips-header">
              <h2 className="join-lobby__tips-title">
                <span className="join-lobby__tips-icon">💡</span>
                <span>Tips</span>
              </h2>
              <button 
                className="join-lobby__tips-toggle" 
                onClick={() => setShowTips(!showTips)}
                aria-label={showTips ? "Hide tips" : "Show tips"}
              >
                {showTips ? '✕' : 'i'}
              </button>
            </div>
            
            <div className="join-lobby__tips-content">
              <div className="join-lobby__tip">
                <span className="join-lobby__tip-icon">📲</span>
                <p>Ask your friend for the lobby ID shown on their screen after they create a game.</p>
              </div>
              
              <div className="join-lobby__tip">
                <span className="join-lobby__tip-icon">🔗</span>
                <p>You can also join by pasting the invite URL your friend shared with you.</p>
              </div>
              
              <div className="join-lobby__tip">
                <span className="join-lobby__tip-icon">⏱️</span>
                <p>Make sure to join before the game starts as you can&apos;t join an ongoing game.</p>
              </div>
              
              <div className="join-lobby__tip">
                <span className="join-lobby__tip-icon">🔤</span>
                <p>Lobby IDs are case-sensitive. Double-check before joining.</p>
              </div>
              
              <div className="join-lobby__tip">
                <span className="join-lobby__tip-icon">👥</span>
                <p>Some lobbies may have player limits set by the host.</p>
              </div>
              
              <div className="join-lobby__create-game">
                <p>Don&apos;t have a lobby to join?</p>
                <button
                  type="button"
                  className="join-lobby__create-button"
                  onClick={handleNavigateToHome}
                >
                  <span>Create Your Own Game</span>
                  <span className="join-lobby__button-icon">➡️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="join-lobby__decoration join-lobby__decoration--top-left"></div>
      <div className="join-lobby__decoration join-lobby__decoration--bottom-right"></div>
    </div>
  );
};

export default JoinLobby;