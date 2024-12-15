import { createContext, useContext, useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create a context for the socket
const socketContext = createContext(null);

const SOCKET_URL_GENERAL = import.meta.env.VITE_WS_URL;
const SOCKET_URL_GROUP = `${SOCKET_URL_GENERAL}group/`;
const SOCKET_URL_CHANNEL = `${SOCKET_URL_GENERAL}channel/`;

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
  const socketGeneralRef = useRef(null);
  const socketGroupRef = useRef(null);
  const socketChannelRef = useRef(null);

  const token = getCookie('accessToken');

  const [connectedGeneral, setConnectedGeneral] = useState(false);
  const [connectedGroup, setConnectedGroup] = useState(false);
  const [connectedChannel, setConnectedChannel] = useState(false);

  useEffect(() => {
    const connectSockets = () => {
      if (!socketGeneralRef.current) {
        // Initialize the socket connection
        socketGeneralRef.current = io(SOCKET_URL_GENERAL, {
          query: { token },
        });
        socketGeneralRef.current.on('connect_error', (err) => {
          console.log(err);
        });
        socketGeneralRef.current.on('connect', () => {
          console.log('Connected to Socket_General.IO server');
          setConnectedGeneral(true);
        });
      }
      if (!socketGroupRef.current) {
        // Initialize the socket connection
        socketGroupRef.current = io(SOCKET_URL_GROUP, {
          query: { token },
        });
        socketGroupRef.current.on('connect_error', (err) => {
          console.log(err);
        });
        socketGroupRef.current.on('connect', () => {
          console.log('Connected to Socket_Group.IO server');
          setConnectedGroup(true);
        });
      }
      if (!socketChannelRef.current) {
        // Initialize the socket connection
        socketChannelRef.current = io(SOCKET_URL_CHANNEL, {
          query: { token },
        });
        socketChannelRef.current.on('connect_error', (err) => {
          console.log(err);
        });
        socketChannelRef.current.on('connect', () => {
          console.log('Connected to Socket_Channel.IO server');
          setConnectedChannel(true);
        });
      }
    };

    connectSockets();

    return () => {
      if (socketGeneralRef.current) {
        socketGeneralRef.current.disconnect();
        socketGeneralRef.current = null;
        setConnectedGeneral(false);
      }
      if (socketGroupRef.current) {
        socketGroupRef.current.disconnect();
        socketGroupRef.current = null;
        setConnectedGroup(false);
      }
      if (socketChannelRef.current) {
        socketChannelRef.current.disconnect();
        socketChannelRef.current = null;
        setConnectedChannel(false);
      }
    };
  }, [token]);

  if (!connectedGeneral || !connectedGroup || !connectedChannel) {
    // Optionally, return a loading indicator or null while waiting
    return null;
  }

  const sockets = {
    socketGeneralRef,
    socketGroupRef,
    socketChannelRef,
  };

  return (
    <socketContext.Provider value={sockets}>{children}</socketContext.Provider>
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
