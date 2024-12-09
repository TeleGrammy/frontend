import React from 'react';

const PickerTabButton = ({ button, index, activeTab, setActiveTab }) => {
  return (
    <button
      key={index}
      data-test-id={`${button.type}-active-tab-button`}
      onClick={() => setActiveTab(button.type)}
      className={`flex-grow p-2 ${
        activeTab === button.type ? 'bg-gray-300 dark:bg-gray-600' : ''
      }`}
    >
      {button.content}
    </button>
  );
};

export default PickerTabButton;
