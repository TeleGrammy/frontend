import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL;

// Helper function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

const token = getCookie('authToken'); // Replace 'authToken' with the name of your cookie

const socket = io(SOCKET_URL, {
  query: {
    token, // Dynamically include the token from cookies
  },
});

export default socket;
