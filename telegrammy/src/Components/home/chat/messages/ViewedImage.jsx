import React from 'react';

const ViewedImage = ({ viewingImage, handleCloseImageView }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center space-y-0 bg-black bg-opacity-75">
      <div className="relative flex flex-row items-center justify-center">
        {/* Center this image */}
        <img
          src={viewingImage}
          alt="Viewing"
          className="h-[50%] w-[50%] cursor-pointer object-contain"
        />
        <button
          data-test-id="viewing-image-exit-button"
          onClick={handleCloseImageView}
          className="m-4 self-start rounded-full bg-black bg-opacity-50 p-2 text-2xl text-white hover:bg-opacity-75"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ViewedImage;
