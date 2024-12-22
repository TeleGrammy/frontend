import React, { act } from 'react';
import Picker from 'emoji-picker-react';
import styles from '../../Chat.module.css';

const ReactionsArea = ({
  activeTab,
  stickers,
  gifs,
  handleEmojiClick,
  fetchStickers,
  handleSelectItem,
  fetchGifs,
}) => {
  const reactions = activeTab === 'stickers' ? stickers : gifs;
  const fetchReactions = activeTab === 'stickers' ? fetchStickers : fetchGifs;
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2">
        {activeTab === 'emoji' ? (
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
        ) : (
          <>
            <input
              data-test-id={`${activeTab}-search-input`}
              type="text"
              className="rounded p-0.5 pl-3 text-gray-600"
              placeholder="Search"
              onChange={(e) => {
                const query = e.target.value;
                fetchReactions(query);
              }}
            />
            <div>
              {/* Ensure stickers is always an array */}
              {reactions && reactions.length > 0 ? (
                reactions.map((reaction, index) => (
                  <img
                    data-test-id={`${index}-sticker-image`}
                    key={index}
                    src={reaction.images.fixed_height.url} // Adjust according to the response structure
                    alt={`${activeTab}`}
                    width="100"
                    onClick={() =>
                      handleSelectItem(reaction.images.fixed_height.url)
                    }
                    className="cursor-pointer"
                  />
                ))
              ) : (
                <p>No {`${activeTab}`} found</p> // Fallback if no stickers are found
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReactionsArea;
