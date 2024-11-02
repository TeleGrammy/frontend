import { useRef, useState } from 'react';

import AddStoryOverlay from './AddStoryOverlay';

import { IoAdd } from 'react-icons/io5';

function AddStory() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef();

  const handleAddStory = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
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
      >
        <IoAdd className="text-2xl" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />

      {showOverlay && (
        <AddStoryOverlay
          file={file}
          previewUrl={previewUrl}
          onClose={closeOverlay}
        />
      )}
    </>
  );
}

export default AddStory;
