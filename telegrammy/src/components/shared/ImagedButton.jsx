import React from 'react';

const ImagedButton = ({
  icon,
  onClick = () => {},
  alt,
  'data-testid': testId,
}) => {
  return (
    <button
      className={`flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white p-2 transition-colors duration-300 ease-in-out hover:bg-gray-200`}
      onClick={onClick}
      data-testid={testId} // Added data-testid to the button
    >
      <img src={icon} className="h-6 w-6" alt={alt} />
    </button>
  );
};

export default ImagedButton;
