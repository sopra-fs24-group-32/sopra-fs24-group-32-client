// src/components/context/AuthReduxBridge.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from './AuthContext';
import { socketActions } from '../../store';
import authService from '../../services/authService';

/**
 * AuthReduxBridge component
 * 
 * This component bridges the Auth context with Redux.
 * It ensures that WebSocket connections are established/disconnected
 * when a user logs in/out.
 */
export const AuthReduxBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, clerkUser, isLoading } = useAuth();
  const dispatch = useDispatch();

  // Handle WebSocket connection based on authentication state
  useEffect(() => {
    const handleAuthStateChange = async () => {
      if (isLoading) return;

      if (isAuthenticated && clerkUser) {
        try {
          // Get session token for WebSocket authentication
          const token = await authService.getSessionToken();
          
          // Connect to WebSocket
          dispatch(socketActions.connect(token));
        } catch (error) {
          console.error('Failed to connect to WebSocket:', error);
        }
      } else {
        // Disconnect from WebSocket when user is not authenticated
        dispatch(socketActions.disconnect());
      }
    };

    handleAuthStateChange();

    // Clean up WebSocket connection on unmount
    return () => {
      dispatch(socketActions.disconnect());
    };
  }, [isAuthenticated, clerkUser, isLoading, dispatch]);

  return <>{children}</>;
};

export default AuthReduxBridge;