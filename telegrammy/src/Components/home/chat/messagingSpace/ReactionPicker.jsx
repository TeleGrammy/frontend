import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import axios from 'axios';
import GifIcon from '../../../icons/GIFIcon';
import StickerIcon from '../../../icons/StickerIcon';
import styles from '../Chat.module.css';

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
      setStickers(response.data.data);
      // console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching Stickers:', error);
    }
  };
  return (
    <>
      <button
        data-test-id="emojis-button"
        onClick={handleClickPicker}
        className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        😊
      </button>
      {isPickerOpen && (
        <div className="absolute bottom-16 left-4 z-50 w-64 rounded-lg bg-gray-100 shadow-lg dark:bg-gray-800">
          {/* Tab Navigation */}
          <div className="flex justify-around border-b border-gray-300 dark:border-gray-600">
            <button
              data-test-id="emoji-button"
              onClick={() => setActiveTab('emoji')}
              className={`flex-grow p-2 ${
                activeTab === 'emoji' ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
            >
              {' '}
              😊
            </button>
            <button
              data-test-id="sticker-active-tab-button"
              onClick={() => setActiveTab('stickers')}
              className={`flex-grow p-2 ${
                activeTab === 'stickers' ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
            >
              <StickerIcon />
            </button>
            <button
              data-test-id="gif-active-tab-button"
              onClick={() => setActiveTab('gifs')}
              className={`flex-grow p-2 ${
                activeTab === 'gifs' ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
            >
              {' '}
              <GifIcon />
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'emoji' && (
              <div className="flex flex-wrap gap-2">
                <Picker
                  set="google" // Use Google's emoji set
                  showPreview={false} // Disable the preview
                  className={styles['custom-picker']}
                  style={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                  }}
                  onEmojiClick={(emoji) => {
                    handleEmojiClick(emoji);
                  }}
                />
              </div>
            )}
            {activeTab === 'stickers' && (
              <div className="flex flex-wrap gap-2">
                <input
                  data-test-id="stickers-search-input"
                  type="text"
                  className="rounded p-0.5 pl-3 text-gray-600"
                  placeholder="Search"
                  onChange={(e) => {
                    const query = e.target.value;
                    fetchStickers(query);
                  }}
                />
                <div>
                  {/* Ensure stickers is always an array */}
                  {stickers && stickers.length > 0 ? (
                    stickers.map((sticker, index) => (
                      <img
                        data-test-id={`${index}-sticker-image`}
                        key={index}
                        src={sticker.images.fixed_height.url} // Adjust according to the response structure
                        alt="Sticker"
                        width="100"
                        onClick={() =>
                          handleSelectItem(sticker.images.fixed_height.url)
                        }
                        className="cursor-pointer"
                      />
                    ))
                  ) : (
                    <p>No stickers found</p> // Fallback if no stickers are found
                  )}
                </div>
              </div>
            )}
            {activeTab === 'gifs' && (
              <div className="flex flex-wrap gap-2">
                <input
                  data-test-id="gif-search-input"
                  type="text"
                  className="rounded p-0.5 pl-3 text-gray-600"
                  placeholder="Search"
                  onChange={(e) => {
                    const query = e.target.value;
                    fetchGifs(query);
                  }}
                />
                <div>
                  {/* Ensure stickers is always an array */}
                  {gifs && gifs.length > 0 ? (
                    gifs.map((gif, index) => (
                      <img
                        data-test-id={`${index}-gif-image`}
                        key={index}
                        src={gif.images.fixed_height.url} // Adjust according to the response structure
                        alt="gif"
                        width="100"
                        onClick={() =>
                          handleSelectItem(gif.images.fixed_height.url)
                        } // Capture selected sticker
                        className="cursor-pointer"
                      />
                    ))
                  ) : (
                    <p>No GIFs found</p> // Fallback if no stickers are found
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReactionPicker;
