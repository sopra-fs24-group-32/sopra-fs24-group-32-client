// src/store/middleware/socket.ts
import { Middleware, AnyAction } from "redux";
import { 
  addPlayer, 
  removePlayer, 
  updatePlayerReadyStatus,
  setLobbyDetails,
  LobbyState  // Import this or define it here
} from "../slices/lobbySlice";

// Define socket event types for TypeScript
export const SOCKET_EVENTS = {
  CONNECT: "SOCKET_CONNECT",
  DISCONNECT: "SOCKET_DISCONNECT",
  JOIN_LOBBY: "SOCKET_JOIN_LOBBY",
  LEAVE_LOBBY: "SOCKET_LEAVE_LOBBY",
  UPDATE_SETTINGS: "SOCKET_UPDATE_SETTINGS",
  START_GAME: "SOCKET_START_GAME"
} as const;

// Create type for socket event values
export type SocketEventType = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

// Define socket action interfaces
interface SocketConnectAction extends AnyAction {
  type: typeof SOCKET_EVENTS.CONNECT;
  payload: {
    token: string;
  };
}

interface SocketDisconnectAction extends AnyAction {
  type: typeof SOCKET_EVENTS.DISCONNECT;
}

interface SocketJoinLobbyAction extends AnyAction {
  type: typeof SOCKET_EVENTS.JOIN_LOBBY;
  payload: {
    lobbyCode: string;
    password?: string;
  };
}

interface SocketLeaveLobbyAction extends AnyAction {
  type: typeof SOCKET_EVENTS.LEAVE_LOBBY;
  payload: {
    lobbyCode: string;
  };
}

interface SocketUpdateSettingsAction extends AnyAction {
  type: typeof SOCKET_EVENTS.UPDATE_SETTINGS;
  payload: {
    lobbyCode: string;
    settings: Partial<LobbyState>;
  };
}

interface SocketStartGameAction extends AnyAction {
  type: typeof SOCKET_EVENTS.START_GAME;
  payload: {
    lobbyCode: string;
  };
}

// Union type for all socket actions
export type SocketAction =
  | SocketConnectAction
  | SocketDisconnectAction
  | SocketJoinLobbyAction
  | SocketLeaveLobbyAction
  | SocketUpdateSettingsAction
  | SocketStartGameAction;

// Define WebSocket message interfaces
interface WebSocketMessage {
  type: string;
  payload: any;
}

interface PlayerJoinedMessage extends WebSocketMessage {
  type: "PLAYER_JOINED";
  payload: {
    id: string;
    username: string;
    isHost: boolean;
    isReady: boolean;
    avatarUrl?: string;
  };
}

interface PlayerLeftMessage extends WebSocketMessage {
  type: "PLAYER_LEFT";
  payload: {
    playerId: string;
  };
}

interface PlayerReadyStatusChangedMessage extends WebSocketMessage {
  type: "PLAYER_READY_STATUS_CHANGED";
  payload: {
    playerId: string;
    isReady: boolean;
  };
}

// Make sure this matches the expected parameters of setLobbyDetails
interface LobbySettingsUpdatedMessage extends WebSocketMessage {
  type: "LOBBY_SETTINGS_UPDATED";
  payload: {
    lobbyName: string;
    numberOfRounds: number;
    timeLimit: number;
    maxPlayers: number;
    isPrivate: boolean;
    difficulty: "easy" | "medium" | "hard";
    gameSettings: string[];
    password?: string;
  };
}

interface GameStartedMessage extends WebSocketMessage {
  type: "GAME_STARTED";
  payload: {
    gameId: string;
  };
}

// Union type for all WebSocket messages
type WebSocketMessageType =
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | PlayerReadyStatusChangedMessage
  | LobbySettingsUpdatedMessage
  | GameStartedMessage;

// This middleware sets up a WebSocket connection and handles socket events
export const socketMiddleware: Middleware = store => {
  let socket: WebSocket | null = null;

  return next => (action: AnyAction) => {
    // Early return if action doesn't have a type
    if (!action.type) {
      return next(action);
    }

    // Type guard to check if the action is a socket action
    const isSocketAction = (action: AnyAction): action is SocketAction => {
      return Object.values(SOCKET_EVENTS).includes(action.type as SocketEventType);
    };

    if (!isSocketAction(action)) {
      return next(action);
    }

    switch (action.type) {
      // Set up connection
      case SOCKET_EVENTS.CONNECT: {
        const connectAction = action as SocketConnectAction;
        
        if (socket !== null) {
          socket.close();
        }

        const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8181/ws";
        socket = new WebSocket(`${wsUrl}?token=${connectAction.payload.token}`);

        socket.onopen = () => {
          console.log("WebSocket connected");
        };

        socket.onclose = () => {
          console.log("WebSocket disconnected");
          socket = null;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Validate message structure before processing
            if (!data || typeof data.type !== "string") {
              console.error("Invalid message format:", data);
              return;
            }
            
            switch (data.type) {
              case "PLAYER_JOINED": {
                const message = data as PlayerJoinedMessage;
                store.dispatch(addPlayer(message.payload));
                break;
              }
              
              case "PLAYER_LEFT": {
                const message = data as PlayerLeftMessage;
                store.dispatch(removePlayer(message.payload.playerId));
                break;
              }
              
              case "PLAYER_READY_STATUS_CHANGED": {
                const message = data as PlayerReadyStatusChangedMessage;
                store.dispatch(updatePlayerReadyStatus({
                  playerId: message.payload.playerId,
                  isReady: message.payload.isReady
                }));
                break;
              }
              
              case "LOBBY_SETTINGS_UPDATED": {
                const message = data as LobbySettingsUpdatedMessage;
                
                // Create a properly formatted object that matches setLobbyDetails requirements
                const lobbyDetails = {
                  lobbyName: message.payload.lobbyName,
                  numberOfRounds: message.payload.numberOfRounds,
                  timeLimit: message.payload.timeLimit,
                  maxPlayers: message.payload.maxPlayers,
                  isPrivate: message.payload.isPrivate,
                  difficulty: message.payload.difficulty,
                  gameSettings: message.payload.gameSettings,
                  password: message.payload.password
                };
                
                store.dispatch(setLobbyDetails(lobbyDetails));
                break;
              }
              
              case "GAME_STARTED": {
                const message = data as GameStartedMessage;
                break;
              }
              
              default:
                console.log("Received unknown message type:", data.type);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };
       
        socket.onerror = (error) => {
          console.error("WebSocket error:"+ error);
        };
       
        break;
      }
       
      case SOCKET_EVENTS.DISCONNECT:
        if (socket !== null) {
          socket.close();
          socket = null;
        }
        break;
       
      // Send events through the socket
      case SOCKET_EVENTS.JOIN_LOBBY:
      case SOCKET_EVENTS.LEAVE_LOBBY:
      case SOCKET_EVENTS.UPDATE_SETTINGS:
      case SOCKET_EVENTS.START_GAME:
        if (socket !== null && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(action));
        }
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;