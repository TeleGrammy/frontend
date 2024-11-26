import React, { useState, useEffect } from 'react';
import PauseIcon from '../../../Components/icons/PauseIcon';
import PlayIcon from '../../../Components/icons/PlayIcon';

const VoiceNotePlayer = ({ src, time, type }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(src));
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Set audio duration when metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    // Update progress bar as the audio plays
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    // Event listeners for audio
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audio]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className={`flex flex-col items-start rounded-3xl ${type === 'sent' ? 'bg-bg-message-sender' : 'bg-bg-message-receiver'} mb-2 max-w-sm p-4 text-white shadow-md`}
    >
      <div className="flex w-full items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow-md"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Waveform and Time */}
        <div className="flex-1">
          {/* Fake waveform */}
          <div className="mb-1 flex space-x-1">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="h-3 w-1 rounded bg-white"
                style={{
                  height: `${(Math.random() + 1) * 6}px`, // Randomize height for waveform
                }}
              ></div>
            ))}
          </div>

          <div className="flex items-center text-sm">
            <span>{formatTime(audio.currentTime)}</span>
            <span className="ml-1">•</span>
            <span className="ml-1">{formatTime(audio.duration)}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full justify-between text-sm text-white/80">
        <span>{time}</span>
        <span>✔✔</span>
      </div>
    </div>
  );
};

export default VoiceNotePlayer;
