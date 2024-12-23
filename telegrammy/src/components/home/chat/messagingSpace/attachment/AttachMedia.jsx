import React, { useState } from 'react';
import AttachmentsMenu from './AttachmentsMenu';

const AttachMedia = ({
  setErrorMessage,
  setSelectedFile,
  setSelectedFileType,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];

    if (file && file.size > 26214400) {
      setErrorMessage('The maximum file size is 25 MB.');
      setSelectedFile(null);
      setSelectedFileType(null);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      setErrorMessage('');
      setSelectedFile(file);
      setSelectedFileType(type);
    }
  };

  const handleFileTypeSelection = (type) => {
    setIsMenuVisible(false);
    document.getElementById(`file-input-${type}`).click();
  };
  return (
    <>
      <div className="relative">
        <button
          data-test-id="toggle-menu-button"
          onClick={toggleMenu}
          className="cursor-pointer"
        >
          📎
        </button>
        {isMenuVisible && (
          <AttachmentsMenu handleFileTypeSelection={handleFileTypeSelection} />
        )}
      </div>
      <input
        data-test-id="attach-image-input"
        type="file"
        onChange={(event) => handleFileChange(event, 'media_image')}
        className="hidden"
        id="file-input-image"
        accept="image/*"
      />
      <input
        data-test-id="attach-video-input"
        type="file"
        onChange={(event) => handleFileChange(event, 'media_video')}
        className="hidden"
        id="file-input-video"
        accept="video/*"
      />
      <input
        data-test-id="attach-document-input"
        type="file"
        onChange={(event) => handleFileChange(event, 'document_document')}
        className="hidden"
        id="file-input-document"
        accept=".pdf,.doc,.docx,.txt"
      />
      <input
        data-test-id="attach-audio-input"
        type="file"
        onChange={(event) => handleFileChange(event, 'audio_audio')}
        className="hidden"
        id="file-input-audio"
        accept="audio/*"
      />
    </>
  );
};

export default AttachMedia;
