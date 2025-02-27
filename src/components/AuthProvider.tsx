import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk, useUser, useSession } from '@clerk/clerk-react';
import authService from '../services/authService';

// Create context for authentication
const AuthContext = createContext(null);

/**
 * AuthProvider component to handle authentication state with Clerk and backend
 */
export const AuthProvider = ({ children }) => {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { session } = useSession();
  const { signOut } = useClerk();
  
  const [backendUser, setBackendUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Handle user registration and login with backend
  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!isUserLoaded) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        if (isSignedIn && user) {
          // Try to get existing user data from backend
          try {
            const userData = await authService.getUserData(user);
            setBackendUser(userData);
            
            // Update login status
            await authService.loginUser(user, session?.id);
          } catch (error) {
            // If user doesn't exist in backend yet, register them
            if (error.response && error.response.status === 404) {
              const newUser = await authService.registerUser(user);
              setBackendUser(newUser);
            } else {
              throw error;
            }
          }
        } else {
          setBackendUser(null);
        }
      } catch (err) {
        console.error('Error syncing user with backend:', err);
        setError(err.message || 'Failed to sync user data with server');
      } finally {
        setIsLoading(false);
      }
    };
    
    syncUserWithBackend();
  }, [isUserLoaded, isSignedIn, user, session]);
  
  // Handle user logout
  const handleLogout = async () => {
    try {
      if (user) {
        await authService.logoutUser(user);
      }
      
      // Then sign out from Clerk
      await signOut();
    } catch (err) {
      console.error('Error during logout:', err);
      setError(err.message || 'Failed to log out');
    }
  };
  
  // Update backend user on profile changes
  const updateUserProfile = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No user is logged in');
      }
      
      // Get token from auth service
      const token = await authService.getSessionToken();
      
      // Call your backend API to update user profile
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setBackendUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user: backendUser, // Your backend user
    clerkUser: user, // Original Clerk user
    isAuthenticated: !!backendUser,
    isLoading,
    error,
    logout: handleLogout,
    updateProfile: updateUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;