import React, { createContext, useState } from "react";
import PropTypes from "prop-types"; 

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);

  return (
    <WebSocketContext.Provider value={{ stompClient, setStompClient }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node // Validate children prop
};

export const useWebSocket = () => {
  return React.useContext(WebSocketContext);
};
