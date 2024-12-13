import { createContext, useContext, useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create a context for the socket
const socketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_WS_URL;

// Helper function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

// Create a provider for the socket context
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      const token = getCookie('accessToken');

      // Initialize the socket connection
      socketRef.current = io(SOCKET_URL, {
        query: { token },
      });
      socketRef.current.on('connect_error', (err) => {
        console.log(err);
      });
      socketRef.current.on('connect', () => {
        console.log('Connected to Socket.IO server');
        setConnected(true);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  if (!connected) {
    // Optionally, return a loading indicator or null while waiting
    return null;
  }

  return (
    <socketContext.Provider value={socketRef}>
      {children}
    </socketContext.Provider>
  );
};

// Custom hook to use the socket instance
export const useSocket = () => {
  const socket = useContext(socketContext);

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};
