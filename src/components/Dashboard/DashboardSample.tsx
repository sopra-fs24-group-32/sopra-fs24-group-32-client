// components/DashboardSample/DashboardSample.jsx
import React, { useState, useEffect } from 'react';
import './DashboardSample.scss';

const DashboardSample = () => {
  // Sample players data with initial scores
  const [players, setPlayers] = useState([
    { id: 1, name: 'Roger B.', avatar: '👨‍💻', score: 0, rank: 1, correctGuesses: 0, totalGuesses: 0 },
    { id: 2, name: 'Eduard G.', avatar: '🧙‍♂️', score: 0, rank: 2, correctGuesses: 0, totalGuesses: 0 },
    { id: 3, name: 'Nicolas H.', avatar: '🚀', score: 0, rank: 3, correctGuesses: 0, totalGuesses: 0 },
    { id: 4, name: 'Eric R.', avatar: '🦊', score: 0, rank: 4, correctGuesses: 0, totalGuesses: 0 },
    { id: 5, name: 'Nicolas S.', avatar: '🐱', score: 0, rank: 5, correctGuesses: 0, totalGuesses: 0 },
  ]);

  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, in-progress, finished
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [activePlayer, setActivePlayer] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);

  // Mock prompts for the demo
  const samplePrompts = [
    'A cat wearing sunglasses surfing on a pizza',
    'Robot playing basketball in outer space',
    'Pirate ship sailing through clouds',
    'Dinosaur having a tea party',
    'Enchanted forest with glowing mushrooms',
  ];

  // Mock image URLs (using placeholders)
  const sampleImages = [
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500',
    'https://images.unsplash.com/photo-1581922819941-6ab31ab79afc?w=500',
    'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=500',
    'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500',
    'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?w=500',
  ];

  // Simulate game progression
  useEffect(() => {
    if (gameStatus === 'waiting') {
      const startGameTimer = setTimeout(() => {
        setGameStatus('in-progress');
        startNewRound();
      }, 3000);
      
      return () => clearTimeout(startGameTimer);
    }
  }, [gameStatus]);

  // Countdown timer for the round
  useEffect(() => {
    if (gameStatus !== 'in-progress' || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          evaluateRound();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStatus, timeRemaining]);

  // Start a new round with a random prompt and image
  const startNewRound = () => {
    // Select a random player to create the prompt
    const prompterIndex = Math.floor(Math.random() * players.length);
    const selectedPlayer = players[prompterIndex];
    setActivePlayer(selectedPlayer);
    
    // Select a random prompt and image
    const promptIndex = currentRound - 1;
    setCurrentPrompt(samplePrompts[promptIndex % samplePrompts.length]);
    setCurrentImage(sampleImages[promptIndex % sampleImages.length]);
    
    // Reset the timer
    setTimeRemaining(30);
    
    // Add event to activity feed
    addEvent(`Round ${currentRound} started! ${selectedPlayer.name} is creating the prompt...`);
    
    // Simulate player submitting a prompt
    setTimeout(() => {
      addEvent(`${selectedPlayer.name} submitted: "${samplePrompts[promptIndex % samplePrompts.length]}"`);
    }, 2000);
    
    // Simulate image generation
    setTimeout(() => {
      addEvent('DALL-E is generating an image...');
    }, 4000);
    
    setTimeout(() => {
      addEvent('Image generated! Players are guessing...');
      simulatePlayerGuesses(selectedPlayer.id);
    }, 6000);
  };

  // Simulate players making guesses
  const simulatePlayerGuesses = (activePlayerId) => {
    // Make sure we have an active player ID
    if (activePlayerId === null) {
      console.error("No active player set for this round");
      return;
    }
    
    const guessingPlayers = players.filter(player => player.id !== activePlayerId);
    
    // Simulate each player making a guess at random intervals
    guessingPlayers.forEach((player, index) => {
      const delay = 5000 + (Math.random() * 10000);
      setTimeout(() => {
        const isCorrect = Math.random() > 0.5;
        addEvent(`${player.name} submitted a guess ${isCorrect ? '(Correct!)' : '(Close, but not quite)'}`);
        
        // Update player stats
        setPlayers(prevPlayers => {
          return prevPlayers.map(p => {
            if (p.id === player.id) {
              const scoreIncrease = isCorrect ? 100 : 30;
              return {
                ...p,
                score: p.score + scoreIncrease,
                correctGuesses: isCorrect ? p.correctGuesses + 1 : p.correctGuesses,
                totalGuesses: p.totalGuesses + 1
              };
            }
            return p;
          });
        });
      }, delay);
    });
  };

  // Evaluate the round and update scores
  const evaluateRound = () => {
    // Sort players by score
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    // Update ranks
    const rankedPlayers = sortedPlayers.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
    
    setPlayers(rankedPlayers);
    
    // Check if the game is finished
    if (currentRound >= totalRounds) {
      setGameStatus('finished');
      addEvent('Game finished! Check the final rankings.');
    } else {
      // Start the next round after a delay
      setTimeout(() => {
        setCurrentRound(prevRound => prevRound + 1);
        startNewRound();
      }, 5000);
      
      addEvent(`Round ${currentRound} completed!`);
    }
  };

  // Add an event to the activity feed
  const addEvent = (message) => {
    setRecentEvents(prevEvents => {
      const newEvents = [{
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleTimeString()
      }, ...prevEvents];
      
      // Keep only the latest 6 events
      return newEvents.slice(0, 6);
    });
  };

  // Handle login button click
  const handleLoginClick = () => {
    // This function would handle the login or signup process
    console.log("Login/signup button clicked");
    // You would typically redirect to a login page or open a modal
  };

  return (
    <div className="dashboard-sample">
      <h2 className="section-title">Live Game Experience</h2>
      <p className="section-description">
        Get a feel for the GPTuessr gaming experience with our live interactive dashboard demo.
        See players in action, watch the game progress, and view the leaderboard in real-time!
      </p>
      
      <div className="dashboard-sample__header">
        <h2 className="dashboard-sample__title">GPTuessr Live Game</h2>
        <div className="dashboard-sample__game-info">
          <div className="dashboard-sample__round">
            Round <span className="dashboard-sample__round-number">{currentRound}</span> of {totalRounds}
          </div>
          {gameStatus === 'in-progress' && (
            <div className="dashboard-sample__timer">
              Time: <span className={`dashboard-sample__time ${timeRemaining < 10 ? 'dashboard-sample__time--low' : ''}`}>
                {timeRemaining}s
              </span>
            </div>
          )}
          <div className="dashboard-sample__status">
            Status: <span className={`dashboard-sample__status-value dashboard-sample__status-value--${gameStatus}`}>
              {gameStatus === 'waiting' ? 'Waiting to Start' : gameStatus === 'in-progress' ? 'In Progress' : 'Game Over'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-sample__content">
        <div className="dashboard-sample__left-panel">
          <div className="dashboard-sample__scoreboard">
            <h3 className="dashboard-sample__panel-title">Leaderboard</h3>
            <div className="dashboard-sample__scores">
              {players.sort((a, b) => a.rank - b.rank).map((player, index) => (
                <div 
                  key={player.id} 
                  className={`dashboard-sample__player-score ${activePlayer && player.id === activePlayer.id ? 'dashboard-sample__player-score--active' : ''}`}
                >
                  <div className="dashboard-sample__player-rank">{player.rank}</div>
                  <div className="dashboard-sample__player-avatar">{player.avatar}</div>
                  <div className="dashboard-sample__player-name">{player.name}</div>
                  <div className="dashboard-sample__player-stats">
                    <div className="dashboard-sample__player-points">{player.score}</div>
                    <div className="dashboard-sample__player-accuracy">
                      {player.totalGuesses > 0 
                        ? Math.round((player.correctGuesses / player.totalGuesses) * 100) 
                        : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-sample__activity">
            <h3 className="dashboard-sample__panel-title">Activity Feed</h3>
            <div className="dashboard-sample__events">
              {recentEvents.map(event => (
                <div key={event.id} className="dashboard-sample__event">
                  <span className="dashboard-sample__event-time">{event.timestamp}</span>
                  <span className="dashboard-sample__event-message">{event.message}</span>
                </div>
              ))}
              {recentEvents.length === 0 && (
                <div className="dashboard-sample__no-events">
                  Game will start soon...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-sample__right-panel">
          <div className="dashboard-sample__game-display">
            <h3 className="dashboard-sample__panel-title">
              {gameStatus === 'waiting' 
                ? 'Waiting for game to start...' 
                : gameStatus === 'finished' 
                  ? 'Game completed!' 
                  : `Current ${activePlayer ? `prompt by ${activePlayer.name}` : 'prompt'}`}
            </h3>
            
            <div className="dashboard-sample__prompt-container">
              {gameStatus === 'in-progress' && activePlayer && (
                <div className="dashboard-sample__prompt">
                  &quot;{currentPrompt}&quot;
                </div>
              )}
              
              <div className="dashboard-sample__image-container">
                {gameStatus === 'in-progress' && currentImage ? (
                  <img 
                    src={currentImage} 
                    alt="AI generated" 
                    className="dashboard-sample__generated-image" 
                  />
                ) : (
                  <div className="dashboard-sample__placeholder">
                    {gameStatus === 'waiting' 
                      ? '🎮 Game will start soon' 
                      : gameStatus === 'finished' 
                        ? '🏆 Game Over! Check the final rankings' 
                        : '🖼️ Image will appear here'}
                  </div>
                )}
              </div>
            </div>
            
            {gameStatus === 'finished' && (
              <div className="dashboard-sample__winner">
                <h3>🎉 Winner: {players.find(p => p.rank === 1)?.name} 🎉</h3>
                <p>with {players.find(p => p.rank === 1)?.score} points</p>
                <button className="dashboard-sample__new-game-btn">Play Again</button>
              </div>
            )}
          </div>

          <div className="dashboard-sample__stats">
            <h3 className="dashboard-sample__panel-title">Game Stats</h3>
            <div className="dashboard-sample__stats-grid">
              <div className="dashboard-sample__stat-card">
                <div className="dashboard-sample__stat-label">Total Guesses</div>
                <div className="dashboard-sample__stat-value">
                  {players.reduce((sum, player) => sum + player.totalGuesses, 0)}
                </div>
              </div>
              <div className="dashboard-sample__stat-card">
                <div className="dashboard-sample__stat-label">Correct Guesses</div>
                <div className="dashboard-sample__stat-value">
                  {players.reduce((sum, player) => sum + player.correctGuesses, 0)}
                </div>
              </div>
              <div className="dashboard-sample__stat-card">
                <div className="dashboard-sample__stat-label">Average Score</div>
                <div className="dashboard-sample__stat-value">
                  {Math.round(players.reduce((sum, player) => sum + player.score, 0) / players.length)}
                </div>
              </div>
              <div className="dashboard-sample__stat-card">
                <div className="dashboard-sample__stat-label">Accuracy</div>
                <div className="dashboard-sample__stat-value">
                  {players.reduce((sum, player) => sum + player.totalGuesses, 0) > 0 
                    ? Math.round((players.reduce((sum, player) => sum + player.correctGuesses, 0) / 
                                 players.reduce((sum, player) => sum + player.totalGuesses, 0)) * 100) 
                    : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add a call-to-action button */}
      <div className="cta-container">
        <button className="cta-button" onClick={handleLoginClick}>
          Try It Yourself
        </button>
        <p className="cta-subtext">Join now and start creating your own games!</p>
      </div>
    </div>
  );
};

export default DashboardSample;