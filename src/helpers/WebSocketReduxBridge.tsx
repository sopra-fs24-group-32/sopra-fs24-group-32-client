// src/helpers/WebSocketReduxBridge.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useWebSocket } from './WebSocketContext';
import { RootState } from '../store';
import { useAppDispatch } from '../store/hooks';
import { 
  addPlayer, 
  removePlayer, 
  updatePlayerReadyStatus, 
  setLobbyDetails 
} from '../store/slices/lobbySlice';

/**
 * WebSocketReduxBridge component
 * 
 * This component acts as a bridge between the WebSocket context and Redux store.
 * It listens for WebSocket events and dispatches appropriate Redux actions.
 * It also listens for Redux actions and sends appropriate WebSocket messages.
 * 
 * This allows components to interact with either the WebSocket context or Redux store
 * without worrying about the details of the other.
 */
export const WebSocketReduxBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, isConnected, sendMessage } = useWebSocket();
  const dispatch = useAppDispatch();
  const lobbyState = useSelector((state: RootState) => state.lobby);

  // Listen for WebSocket events and dispatch Redux actions
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (!data || typeof data.type !== 'string') {
          console.error('Invalid message format:', data);
          return;
        }
        
        switch (data.type) {
          case 'PLAYER_JOINED':
            dispatch(addPlayer(data.payload));
            break;
            
          case 'PLAYER_LEFT':
            dispatch(removePlayer(data.payload.playerId));
            break;
            
          case 'PLAYER_READY_STATUS_CHANGED':
            dispatch(updatePlayerReadyStatus({
              playerId: data.payload.playerId,
              isReady: data.payload.isReady
            }));
            break;
            
          case 'LOBBY_SETTINGS_UPDATED':
            dispatch(setLobbyDetails(data.payload));
            break;
            
          case 'GAME_STARTED':
            // Handle game start - could dispatch a navigation action
            break;
            
          default:
            console.log('Received unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, dispatch]);

  // Optional: Sync Redux lobby state changes with WebSocket
  // This could be middleware but for simplicity we're doing it here
  useEffect(() => {
    if (isConnected && lobbyState.lobbyCode) {
      // Example of sending lobby updates over WebSocket
      // You might want to debounce this or be more selective about when to send
      sendMessage({
        type: 'LOBBY_STATE_UPDATE',
        payload: lobbyState
      });
    }
  }, [isConnected, lobbyState, sendMessage]);

  return <>{children}</>;
};

export default WebSocketReduxBridge;