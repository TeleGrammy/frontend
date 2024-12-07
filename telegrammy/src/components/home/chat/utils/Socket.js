// socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL;


const socket = io(SOCKET_URL, {
  query: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjI1OWUzZDUzZWEyNjQ1MjU2NTQyMiIsIm5hbWUiOiJuZXdVc2VyIiwiZW1haWwiOiJlbHJvc2hkeTIzQGdtYWlsLmNvbSIsInBob25lIjoiKzIwMTI3MTQ0NjQ1NSIsImxvZ2dlZE91dEZyb21BbGxEZXZpY2VzQXQiOm51bGwsImlhdCI6MTczMzU3OTQ3MSwiZXhwIjoxNzMzNTgzMDcxLCJhdWQiOiJteWFwcC11c2VycyIsImlzcyI6Im15YXBwIn0.-P3CODvsrYqZdbIOijwL_O4fNLxkGA3RdndpvTPKuuE',
  },
});

export default socket;
