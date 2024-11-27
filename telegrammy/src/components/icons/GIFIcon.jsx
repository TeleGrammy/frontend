import React from 'react';

const GifIcon = () => {
  return (
    <svg
      className="mx-2"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect 
        x="2" 
        y="2" 
        width="20" 
        height="20" 
        rx="4" 
        fill="#FF4081" 
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="#FFFFFF"
        fontFamily="Arial, sans-serif"
      >
        GIF
      </text>
    </svg>
  );
};

export default GifIcon;
