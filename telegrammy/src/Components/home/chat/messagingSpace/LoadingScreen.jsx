import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex items-center space-x-2">
        <ClipLoader color="#fff" size={20} />
        <span className="text-white">Uploading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
