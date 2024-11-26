import { useRef, useState } from 'react';

import AddStoryOverlay from './AddStoryOverlay';

import { IoAdd } from 'react-icons/io5';

function AddStory() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef();

  const handleAddStory = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const type = selectedFile.type.split('/')[0];

      // Check if the selected file is a video
      if (type === 'video') {
        const maxSizeInBytes = 100 * 1024 * 1024; // 100 MB

        // Check if the video file size is less than 100 MB
        if (selectedFile.size > maxSizeInBytes) {
          alert('Video file is too large. Please select a file under 100 MB.');
          return;
        }
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setFileType(type); // to get the type of file (image or video)
      setShowOverlay(true);
      event.target.value = null;
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <button
        className="absolute bottom-4 right-4 rounded-full bg-bg-button p-2 text-text-primary shadow-lg hover:bg-bg-button-hover"
        onClick={handleAddStory}
        data-test-id="add-story-button"
      >
        <IoAdd className="text-2xl" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,video/*"
        data-test-id="add-story-file-input"
      />

      {showOverlay && (
        <AddStoryOverlay
          file={file}
          previewUrl={previewUrl}
          onClose={closeOverlay}
          fileType={fileType}
        />
      )}
    </>
  );
}

export default AddStory;
