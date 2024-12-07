import React from 'react';
import PickerTabButton from './PickerTabButton';

const ReactionTypeSelector = ({ buttonsData, activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-around border-b border-gray-300 dark:border-gray-600">
      {buttonsData.map((button, index) => {
        return (
          <PickerTabButton
            key={index}
            button={button}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        );
      })}
    </div>
  );
};

export default ReactionTypeSelector;
