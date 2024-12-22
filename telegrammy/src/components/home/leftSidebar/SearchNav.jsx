import React from 'react';

const SearchNav = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="m-2 flex w-[90%] justify-around border-b border-border-search text-sm font-bold">
      {['Chats', 'Text', 'Images', 'Videos', 'Links'].map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)} // Update the selected Category on click
          className={`py-2 ${
            selectedCategory === category
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400'
          } hover:text-white`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default SearchNav;
