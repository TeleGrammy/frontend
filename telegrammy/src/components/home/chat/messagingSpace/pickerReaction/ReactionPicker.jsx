import React, { useState } from 'react';
import axios from 'axios';
import GifIcon from '../../../../icons/GIFIcon';
import StickerIcon from '../../../../icons/StickerIcon';
import ReactionTypeSelector from './ReactionTypeSelector';
import ReactionsArea from './ReactionsArea';
import PickerPopup from './PickerPopup';

const ReactionPicker = ({ setInputValue, handleSelectItem }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('emoji'); // Tabs: 'emoji', 'stickers', 'gifs'
  const [gifs, setGifs] = useState([]);
  const [stickers, setStickers] = useState([]);
  const handleClickPicker = () => {
    setIsPickerOpen((isPickerOpen) => !isPickerOpen);
  };

  const handleEmojiClick = (emojiObject) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };

  const fetchGifs = async (query) => {
    const API_KEY = 'qU4yFyriCMVi6jpjzbUkcFH8CExbUGHK';
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=5&offset=0&rating=g&lang=en`; // Giphy API endpoint for searching Stickers
    try {
      const response = await axios.get(url);
      console.log(response.data.data);
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const fetchStickers = async (query) => {
    const API_KEY = 'qU4yFyriCMVi6jpjzbUkcFH8CExbUGHK';
    const url = `https://api.giphy.com/v1/stickers/search?api_key=${API_KEY}&q=${query}&limit=5`; // Giphy API endpoint for searching Stickers
    try {
      const response = await axios.get(url);
      console.log(response.data.data);
      setStickers(response.data.data);
      // console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching Stickers:', error);
    }
  };

  const buttonsData = [
    {
      type: 'emoji',
      content: '😊',
    },
    {
      type: 'stickers',
      content: <StickerIcon />,
    },
    {
      type: 'gifs',
      content: <GifIcon />,
    },
  ];
  return (
    <>
      <button
        data-test-id="emojis-button"
        onClick={handleClickPicker}
        className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        😊
      </button>
      <PickerPopup isPickerOpen={isPickerOpen}>
        <ReactionTypeSelector
          buttonsData={buttonsData}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        {/* Tab Content */}
        <ReactionsArea
          activeTab={activeTab}
          stickers={stickers}
          gifs={gifs}
          handleEmojiClick={handleEmojiClick}
          fetchStickers={fetchStickers}
          handleSelectItem={handleSelectItem}
          fetchGifs={fetchGifs}
        />
      </PickerPopup>
    </>
  );
};

export default ReactionPicker;
