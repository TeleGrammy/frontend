import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCallOverlayOpen: false, // Overlay for incoming call
  callID: null, // Call ID
  chatId: null, // Chat object ID
  callState: 'no call', // 'ringing', 'in call', 'incoming call', or 'no call'
  participants: [],
  callTime: '00:00', // Call duration in seconds
  intervalId: null, // Timer reference for counting call duration
  endCallFromCallerRef: null, // Reference to endCall function in Caller component
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    // function to start call
    startCall: (state, action) => {
      state.participants = action.payload.participants;
      state.chatId = action.payload.chatId;
      state.callID = action.payload.callID;
      state.endCallFromCallerRef = action.payload.endCallFromCallerRef;
      state.isCallOverlayOpen = true;
      state.callState = 'ringing';
    },
    incomingCall: (state, action) => {
      state.participants = action.payload.participants;
      state.chatId = action.payload.chatId;
      state.callID = action.payload.callID;
      state.isCallOverlayOpen = true;
      state.callState = 'incoming call';
    },
    // function to accept call
    acceptCall: (state) => {
      state.callState = 'in call';
      state.callTime = '00:00';
    },
    // function to decline call
    declineCall: (state) => {
      state.callState = 'no call';
      state.participants = [];
      state.chatId = null;
      state.callID = null;
      state.endCallFromCallerRef = null;
      state.intervalId = null;
      state.isCallOverlayOpen = false;
    },
    calldeclined: (state) => {
      state.callState = 'callDeclined';
    },
    // function to end call
    endCall: (state) => {
      state.callState = 'no call';
      if (state.intervalId) {
        clearInterval(state.intervalId); // Clear interval when call ends
      }
      state.participants = [];
      state.chatId = null;
      state.callID = null;
      state.endCallFromCallerRef = null;
      state.intervalId = null;
      state.isCallOverlayOpen = false;
    },
    // function to close overlay
    closeOverlay: (state) => {
      state.isCallOverlayOpen = false;
    },
    openOverlay: (state) => {
      state.isCallOverlayOpen = true;
    },
    updateTime(state, action) {
      state.callTime = action.payload;
    },
    setIntervalId(state, action) {
      state.intervalId = action.payload;
    },
  },
});

export const {
  startCall,
  acceptCall,
  declineCall,
  endCall,
  closeOverlay,
  updateTime,
  setIntervalId,
  openOverlay,
  incomingCall,
  calldeclined,
} = callSlice.actions;

export default callSlice.reducer;
