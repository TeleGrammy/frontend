import React, { createContext, useRef, useContext } from 'react';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const endCallFromCallerRef = useRef(null);
  const muteRef = useRef(null);

  return (
    <CallContext.Provider value={{ endCallFromCallerRef, muteRef }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const call = useContext(CallContext);

  if (!call) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return call;
};
