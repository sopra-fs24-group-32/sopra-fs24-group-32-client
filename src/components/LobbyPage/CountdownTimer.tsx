import React, { useState, useEffect, useRef } from 'react';
import './CountdownTimer.scss';

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  showMilliseconds?: boolean;
  size?: 'small' | 'medium' | 'large';
  autoStart?: boolean;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onComplete,
  showMilliseconds = false,
  size = 'medium',
  autoStart = true,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds * 1000);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasStarted, setHasStarted] = useState(autoStart);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  
  // Format time as MM:SS or MM:SS.MS
  const formatTime = (ms: number) => {
    if (ms <= 0) {
      return showMilliseconds ? '00:00.000' : '00:00';
    }
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    
    if (showMilliseconds) {
      const millisecondsStr = milliseconds.toString().padStart(3, '0');
      return `${minutesStr}:${secondsStr}.${millisecondsStr}`;
    }
    
    return `${minutesStr}:${secondsStr}`;
  };
  
  // Calculate percentage of time left
  const percentage = Math.max(0, Math.min(100, (timeLeft / (initialSeconds * 1000)) * 100));
  
  // Get color based on time left
  const getColor = () => {
    if (percentage > 60) return 'green';
    if (percentage > 30) return 'orange';
    return 'red';
  };
  
  // Start the timer
  const startTimer = () => {
    if (hasStarted && !isRunning) {
      // Resume from paused state
      startTimeRef.current = Date.now() - (initialSeconds * 1000 - pausedTimeRef.current);
    } else {
      // Start fresh
      startTimeRef.current = Date.now();
      setHasStarted(true);
    }
    
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const newTimeLeft = Math.max(0, initialSeconds * 1000 - elapsedTime);
      
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        if (onComplete) onComplete();
      }
    }, 10); // Update every 10ms for smooth animation
  };
  
  // Pause the timer
  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      pausedTimeRef.current = timeLeft;
      setIsRunning(false);
    }
  };
  
  // Reset the timer
  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(initialSeconds * 1000);
    setIsRunning(false);
    setHasStarted(false);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  };
  
  // Start timer on mount if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  // Update when initialSeconds changes
  useEffect(() => {
    if (!hasStarted || !isRunning) {
      setTimeLeft(initialSeconds * 1000);
    }
  }, [initialSeconds]);
  
  return (
    <div className={`countdown-timer ${size} ${className}`}>
      <div className="timer-display">{formatTime(timeLeft)}</div>
      
      <div className="timer-progress-container">
        <div
          className={`timer-progress ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="timer-controls">
        {!isRunning && (
          <button 
            onClick={startTimer} 
            className="timer-button start"
            disabled={timeLeft <= 0}
          >
            {hasStarted ? 'Resume' : 'Start'}
          </button>
        )}
        
        {isRunning && (
          <button 
            onClick={pauseTimer} 
            className="timer-button pause"
          >
            Pause
          </button>
        )}
        
        <button 
          onClick={resetTimer} 
          className="timer-button reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CountdownTimer;