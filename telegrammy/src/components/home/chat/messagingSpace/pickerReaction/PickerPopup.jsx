import React from 'react';

const PickerPopup = ({ isPickerOpen, children }) => {
  return (
    <>
      {isPickerOpen && (
        <div className="absolute bottom-16 left-4 z-50 w-64 rounded-lg bg-gray-100 shadow-lg dark:bg-gray-800">
          {/* Tab Navigation */}
          {children}
        </div>
      )}
    </>
  );
};

export default PickerPopup;
