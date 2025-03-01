import React, { useState, useEffect } from 'react';
import { 
  FaInfoCircle, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaExclamationCircle,
  FaTimes
} from 'react-icons/fa';
import './NotificationSystem.scss';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  notifications, 
  onDismiss 
}) => {
  // Get icon based on notification type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <FaInfoCircle />;
      case 'success':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaExclamationCircle />;
      default:
        return <FaInfoCircle />;
    }
  };
  
  // Set up auto-dismiss timers
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
        
        timers.push(timer);
      }
    });
    
    // Clean up timers on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, onDismiss]);
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification-item ${notification.type}`}
        >
          <div className="notification-icon">
            {getIcon(notification.type)}
          </div>
          <div className="notification-message">
            {notification.message}
          </div>
          <button 
            className="notification-dismiss" 
            onClick={() => onDismiss(notification.id)}
            aria-label="Dismiss notification"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;