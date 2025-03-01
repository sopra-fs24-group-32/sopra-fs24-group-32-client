import { useState, useCallback } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface UseNotificationsResult {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, duration?: number) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

/**
 * Custom hook for managing notifications in the application
 */
export const useNotifications = (): UseNotificationsResult => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  /**
   * Add a new notification
   * @param type The type of notification (info, success, warning, error)
   * @param message The notification message
   * @param duration The duration in ms before auto-dismissal (0 for no auto-dismiss)
   * @returns The ID of the newly created notification
   */
  const addNotification = useCallback(
    (type: NotificationType, message: string, duration = 5000): string => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setNotifications(prevNotifications => [
        ...prevNotifications,
        { id, type, message, duration }
      ]);
      
      return id;
    },
    []
  );
  
  /**
   * Remove a notification by ID
   * @param id The ID of the notification to remove
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);
  
  /**
   * Remove all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};

export default useNotifications;