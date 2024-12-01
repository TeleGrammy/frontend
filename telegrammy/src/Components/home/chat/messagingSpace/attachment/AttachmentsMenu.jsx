import React from 'react';

const AttachmentsMenu = ({ handleFileTypeSelection }) => {
  return (
    <div className="absolute bottom-full mb-2 flex flex-col space-y-1 bg-white p-2 shadow-lg dark:bg-gray-700">
      <button
        data-test-id="attach-image-button"
        onClick={() => handleFileTypeSelection('image')}
        className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        Image
      </button>
      <button
        data-test-id="attach-video-button"
        onClick={() => handleFileTypeSelection('video')}
        className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        Video
      </button>
      <button
        data-test-id="attach-document-button"
        onClick={() => handleFileTypeSelection('document')}
        className="text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        Document
      </button>
    </div>
  );
};

export default AttachmentsMenu;
