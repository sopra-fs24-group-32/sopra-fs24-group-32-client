// src/services/lobbyService.ts
import { api, handleError } from '../helpers/api';
import AuthService from './authService';

// Interface for lobby creation request
export interface CreateLobbyRequest {
  numberOfRounds: number;
  timeLimit: number;
  maxPlayers: number;
  isPrivate: boolean;
  difficulty: string;
  gameSettings: string[];
}

// Interface for joining a lobby request
export interface JoinLobbyRequest {
  lobbyCode: string;
  password?: string;
}

// Lobby service for API interactions
class LobbyService {
  /**
   * Create a new game lobby
   * @param lobbyData The lobby data to create
   * @returns The created lobby data with lobby code
   */
  async createLobby(lobbyData: CreateLobbyRequest): Promise<any> {
    try {
      // Get auth token
      const token = await AuthService.getSessionToken();
      
      // Send API request to create lobby
      const response = await api.post('/lobbies/create', lobbyData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
  
  /**
   * Join an existing lobby
   * @param joinData The data needed to join a lobby
   * @returns The lobby data
   */
  async joinLobby(joinData: JoinLobbyRequest): Promise<any> {
    try {
      const token = await AuthService.getSessionToken();
      
      const response = await api.post('/lobbies/join', joinData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
  
  /**
   * Leave a lobby
   * @param lobbyCode The code of the lobby to leave
   * @returns Success status
   */
  async leaveLobby(lobbyCode: string): Promise<any> {
    try {
      const token = await AuthService.getSessionToken();
      
      const response = await api.post('/lobbies/leave', { lobbyCode }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
  
  /**
   * Get lobby details
   * @param lobbyCode The code of the lobby to retrieve
   * @returns The lobby data
   */
  async getLobbyDetails(lobbyCode: string): Promise<any> {
    try {
      const token = await AuthService.getSessionToken();
      
      const response = await api.get(`/lobbies/${lobbyCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("fetch lobby details directly from the API:" + response.data);
      
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
  
  /**
   * Start the game in a lobby
   * @param lobbyCode The code of the lobby to start the game
   * @returns Game initialization data
   */
  async startGame(lobbyCode: string): Promise<any> {
    try {
      const token = await AuthService.getSessionToken();
      
      const response = await api.post(`/lobbies/${lobbyCode}/start`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
}

export default new LobbyService();