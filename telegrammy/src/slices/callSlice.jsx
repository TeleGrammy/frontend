import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCallOverlayOpen: false, // Overlay for incoming call
  callState: 'no call', // 'ringing', 'in call', 'incoming call', or 'no call'
  callTime: '00:00', // Call duration in seconds
  participants: {}, //{CALLER and CHATID}
  intervalId: null, // Timer reference for counting call duration
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    // function to start call
    startCall: (state, action) => {
      state.participants = action.payload.participants; // e.g., { caller, CHATID }
      state.isCallOverlayOpen = true;
      state.callState =
        JSON.parse(localStorage.getItem('user')) === state.participants.CALLER
          ? 'ringing'
          : 'incoming call';
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
      state.isCallOverlayOpen = false;
    },
    // function to end call
    endCall: (state) => {
      state.callState = 'no call';
      if (state.intervalId) {
        clearInterval(state.intervalId); // Clear interval when call ends
      }
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
} = callSlice.actions;
export default callSlice.reducer;
