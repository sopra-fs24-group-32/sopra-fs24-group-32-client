// src/services/authService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8181/api';

/**
 * Service to handle authentication with Clerk and backend integration
 */
class AuthService {
  /**
   * Register a new user with the backend
   * @param {Object} clerkUser The user object from Clerk
   * @returns {Promise} A promise that resolves to the registered user data
   */
  async registerUser(clerkUser) {
    try {
      // Extract primary email
      const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
      
      // Extract first and last name if available
      const firstName = clerkUser.firstName || '';
      const lastName = clerkUser.lastName || '';
      
      // Create the user data object for backend
      const userData = {
        clerkUserId: clerkUser.id,
        username: clerkUser.username || primaryEmail.split('@')[0],
        email: primaryEmail,
        firstName: firstName,
        lastName: lastName,
        profilePicture: clerkUser.imageUrl || '',
        providerInfo: {}
      };
      
      // Add OAuth provider information if available
      if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
        clerkUser.externalAccounts.forEach(account => {
          userData.providerInfo[account.provider] = account.externalId;
        });
      }
      
      const token = await this.getSessionToken();
      
      // Register user with backend
      const response = await axios.post(`${API_URL}/users/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
  
  /**
   * Update the backend when a user logs in
   * @param {Object} clerkUser The user object from Clerk
   * @param {String} sessionId The Clerk session ID
   * @returns {Promise} A promise that resolves to the updated user data
   */
  async loginUser(clerkUser, sessionId) {
    try {
      const token = await this.getSessionToken();
      
      const loginData = {
        clerkUserId: clerkUser.id,
        clerkSessionId: sessionId
      };
      
      const response = await axios.post(`${API_URL}/users/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }
  
  /**
   * Update the backend when a user logs out
   * @param {Object} clerkUser The user object from Clerk
   * @returns {Promise} A promise that resolves when logout is successful
   */
  async logoutUser(clerkUser) {
    try {
      const token = await this.getSessionToken();
      
      const logoutData = {
        clerkUserId: clerkUser.id
      };
      
      await axios.post(`${API_URL}/users/logout`, logoutData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error logging out user:', error);
      // Don't throw error on logout to prevent blocking the UI
      return false;
    }
  }
  
  /**
   * Get user data from backend
   * @param {Object} clerkUser The user object from Clerk
   * @returns {Promise} A promise that resolves to the user data
   */
  async getUserData(clerkUser) {
    try {
      const token = await this.getSessionToken();
      
      const response = await axios.get(`${API_URL}/users/${clerkUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
  
  /**
   * Helper method to get a session token using Clerk's global session
   * @returns {Promise<string>} A promise that resolves to the session token
   */
  async getSessionToken() {
    // Use the clerk-js global object to get current session token
    if (window.Clerk && window.Clerk.session) {
      try {
        return await window.Clerk.session.getToken();
      } catch (error) {
        console.error('Error getting token from Clerk session:', error);
        // Fall through to alternative method
      }
    }
    
    // Fallback to alternative method
    try {
      // Using axios directly instead of undefined 'api'
      const response = await axios.post('/api/clerk/getToken');
      const token = response.data.token;
      return token;
    } catch (error) {
      console.error('Failed to get session token', error);
      throw new Error('Not authenticated');
    }
  }
}

export default new AuthService();