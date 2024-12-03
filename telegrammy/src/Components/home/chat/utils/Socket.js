// socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL;

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Use WebSocket protocol
});

export default socket;
