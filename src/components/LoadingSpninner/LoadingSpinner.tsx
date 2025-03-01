import React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...',
  fullScreen = false
}) => {
  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className={`loading-spinner ${size}`}>
        <div className="spinner-circles">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;