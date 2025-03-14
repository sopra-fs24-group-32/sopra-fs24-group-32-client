import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useClerk, useUser, useSession } from '@clerk/clerk-react';
import authService from '../../services/authService';
import { api } from "helpers/api";

// Define types for the context
interface AuthContextType {
  user: any;
  clerkUser: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  updateProfile: (userData: any) => Promise<any>;
}

// Create context for authentication with default value
const AuthContext = createContext<AuthContextType | null>(null);

// Define props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component to handle authentication state with Clerk and backend
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { session } = useSession();
  const { signOut } = useClerk();
  
  const [backendUser, setBackendUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Handle user registration and login with backend
  useEffect(() => {
    const syncUserWithBackend = async () => {
      // Don't proceed until Clerk has loaded user data
      if (!isUserLoaded) {
        console.log('Clerk user data not yet loaded');
        return;
      }
      
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
          } catch (error: any) {
            console.error('Error fetching user data:', error);
            
            // If user doesn't exist in backend yet, register them
            if (error.response && error.response.status === 404) {
              console.log('User not found in backend, registering new user');
              const newUser = await authService.registerUser(user);
              console.log('User registered successfully:', newUser);
              setBackendUser(newUser);
            } else {
              console.error('Non-404 error during user fetch:', error);
              throw error;
            }
          }
        } else {
          console.log('User not signed in, setting backend user to null');
          setBackendUser(null);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to sync user data with server';
        console.error('Error syncing user with backend:', err);
        console.error('Error details:', err.response?.data || err);
        setError(errorMessage);
        // Still set backend user to null on error
        setBackendUser(null);
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
    } catch (err: any) {
      console.error('Error during logout:', err);
      setError(err.message || 'Failed to log out');
    }
  };
  
  // Update backend user on profile changes
  const updateUserProfile = async (userData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No user is logged in');
      }
      
      // Get token from auth service
      const token = await authService.getSessionToken();
      
      // Call your backend API to update user profile
      // Fix: use axios or your API helper correctly
      const response = await api.put(`/api/users/${user.id}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const updatedUser = response.data;
      setBackendUser(updatedUser);
      
      return updatedUser;
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const value: AuthContextType = {
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
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;