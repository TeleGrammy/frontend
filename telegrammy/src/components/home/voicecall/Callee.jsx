import React from 'react';

function Callee({ localAudioRef, remoteAudioRef }) {
  return (
    <>
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}

export default Callee;
