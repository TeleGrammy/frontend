import React, { useState } from 'react';

const VoiceNoteButton = ({ onSendVoice }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleRecordStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voiceNote.webm');
        onSendVoice(formData);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const handleRecordStop = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleRecord = () => {
    if (recording) {
      handleRecordStop();
    } else {
      handleRecordStart();
    }
  };

  return (
    <button
      onClick={handleRecord}
      className={`voice-note-button ${recording ? 'recording' : ''} text-text-primary`}
      data-test-id="voice-note-button"
    >
      {recording ? 'Recording...' : 'Press to Record'}
    </button>
  );
};

export default VoiceNoteButton;
