import React from "react";

const ImagedButton = ({ icon, onClick = () => {}, alt }) => {
  return (
    <button
      className={`flex items-center justify-center bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-200 transition-colors duration-300 ease-in-out w-12 h-12`}
      onClick={onClick}
    >
      <img src={icon} className="w-6 h-6" alt={alt} />
    </button>
  );
};

export default ImagedButton;
