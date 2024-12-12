import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL;

// Helper function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

// Custom hook
function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      const token = getCookie('accessToken'); // Replace 'accessToken' with your cookie name

      // Initialize the socket connection
      socketRef.current = io(SOCKET_URL, {
        query: {
          token,
        },
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Cleanup socket connection
        console.log('Socket disconnected');
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures it runs only once

  return socketRef.current;
}

export default useSocket;
