import { FaRegEye } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

function MyStory({ story, index, handleClick }) {
  const [thumbnail, setThumbnail] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (story.mediaType === 'video' && videoRef.current) {
      const videoElement = videoRef.current;

      const handleLoadedData = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth || 320; // Fallback width
          canvas.height = videoElement.videoHeight || 180; // Fallback height
          const context = canvas.getContext('2d');
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL('image/png');
          setThumbnail(thumbnailDataUrl);
        } catch (error) {
          console.error('Error generating video thumbnail:', error);
        }
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);

      // Cleanup listener when the component unmounts
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [story.mediaType]);

  return (
    <>
      <div
        className="relative"
        onClick={handleClick}
        data-test-id={`${index}-show-my-story-div`}
      >
        <div className="absolute bottom-0 left-0 flex select-none flex-row items-center p-1">
          {/* <FaRegEye className="text-sm text-white" /> */}
          <span className="ml-1 text-xs text-white">{story.views}</span>
        </div>
        {story.mediaType === 'picture' ? (
          <img
            src={story.media}
            alt={`Story ${index + 1}`}
            className="h-full w-full rounded-lg"
          />
        ) : (
          <>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={`Story ${index + 1} Thumbnail`}
                className="h-full w-full rounded-lg"
              />
            ) : (
              <img
                src="playButton.jpg"
                alt={`Story ${index + 1} Thumbnail`}
                className="h-full w-full rounded-lg"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default MyStory;
