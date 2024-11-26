import React, { useRef, useState, useEffect } from 'react';

import { toast } from 'react-toastify';

import { Stage, Layer, Image as KonvaImage, Text, Line } from 'react-konva';

import { ClipLoader } from 'react-spinners';

import {
  IoColorPalette,
  IoClose,
  IoBrush,
  IoArrowForward,
  IoTrash,
} from 'react-icons/io5';

const apiUrl = import.meta.env.VITE_API_URL;

const AddStoryOverlay = ({ file, previewUrl, onClose, fileType }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [texts, setTexts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeDraw, setActiveDraw] = useState(false);
  const [color, setColor] = useState('white');
  const colorRef = useRef(null);
  const [lines, setLines] = useState([]);
  const stageRef = useRef(null);
  const [stageDimensions, setStageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [activeTextIndex, setActiveTextIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  //toast

  const showToast = (message, success) => {
    if (success) {
      toast.success(message, {
        position: 'top-right',
      });
    } else {
      toast.error(message, {
        position: 'top-right',
      });
    }
  };

  // Handle adding a new text element
  const handleAddText = () => {
    setTexts([...texts, { text: 'edit me', x: 50, y: 50, color }]); // Set initial position of text
  };

  // Handle editing text
  const handleTextClick = (index) => {
    setActiveTextIndex(index);
    setEditingText(texts[index].text);
  };

  // Handle editing text
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setEditingText(newValue);

    if (newValue.trim() === '') {
      // Remove the text item if the new value is empty
      const updatedTexts = texts.filter(
        (_, index) => index !== activeTextIndex,
      );
      setTexts(updatedTexts);
    } else {
      // Update the text item if new value is not empty
      const updatedTexts = [...texts];
      updatedTexts[activeTextIndex].text = newValue;
      updatedTexts[activeTextIndex].color = color;
      setTexts(updatedTexts);
    }
    setActiveTextIndex(null); // Reset active text index
  };

  // Handle dragging text
  const handleEndDrag = (e, index) => {
    {
      const newTexts = texts.slice();
      newTexts[index] = {
        ...newTexts[index],
        x: e.target.x(),
        y: e.target.y(),
      };
      setTexts(newTexts);
    }
  };

  // Drawing functionality
  const handleMouseDown = () => {
    if (!activeDraw) return;
    setIsDrawing(true);
    const pos = stageRef.current.getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color }]);
  };

  const handleMouseMove = () => {
    if (!isDrawing) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    setLines(lines.slice(0, lines.length - 1).concat(lastLine));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Handle color input
  const handleInputColor = () => {
    colorRef.current.click();
  };

  // Export the canvas as an image
  const handleExport = async () => {
    let blob;

    if (fileType === 'image') {
      const dataUrl = stageRef.current.toDataURL();
      const response = await fetch(dataUrl);
      blob = await response.blob();
    } else if (fileType === 'video') {
      blob = file; // Directly use the video file
    }

    const formData = new FormData();
    formData.append('content', caption); // 'content' field
    formData.append('story', blob, file.name);

    try {
      setIsLoading(true);

      const res = await fetch(`${apiUrl}/v1/user/stories`, {
        method: 'POST',
        headers: {
          Accept: 'application/json', // Specify JSON response expected
        },
        credentials: 'include', // Include credentials (cookies)
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        showToast('Story uploaded successfully', true);
        onClose();
      } else {
        showToast('Error uploaded Story', false);
      }
    } catch (error) {
      showToast('Error Fetch', false);
    } finally {
      setIsLoading(false);
    }
  };

  //download the image
  // const handleDownload = () => {
  //   const dataUrl = stageRef.current.toDataURL();
  //   const link = document.createElement('a');
  //   link.href = dataUrl;
  //   link.download = 'story.png';
  //   link.click();
  // };

  // Update stage dimensions based on the container size
  useEffect(() => {
    if (fileType === 'video') return;

    const updateDimensions = () => {
      const container = stageRef.current.getStage().container();
      setStageDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [file]);

  // Load the image and resize it to fit the stage dimensions
  useEffect(() => {
    if (fileType === 'image') {
      const img = new window.Image();
      img.src = previewUrl;
      img.crossOrigin = 'anonymous'; // Prevents cross-origin issues when exporting
      img.onload = () => {
        setImage(img);
      };
    }
  }, [previewUrl, fileType]);

  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="h-[90vh] w-full max-w-lg rounded-lg bg-transparent p-4 shadow-lg">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-text-primary"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        {/* Konva Canvas */}
        <div className="relative h-full w-full border-bg-secondary">
          {fileType === 'video' ? (
            // Render video if fileType is 'video'
            <video
              src={previewUrl}
              controls
              className="h-full w-full rounded-lg"
            />
          ) : (
            <Stage
              width={stageDimensions.width}
              height={stageDimensions.height}
              className="br h-full w-full rounded-lg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              ref={stageRef}
            >
              <Layer>
                {image && (
                  <KonvaImage
                    image={image}
                    x={0}
                    y={0}
                    width={stageDimensions.width}
                    height={stageDimensions.height}
                  />
                )}
                {texts.map((textItem, index) => (
                  <Text
                    key={index}
                    text={textItem.text}
                    x={textItem.x}
                    y={textItem.y}
                    draggable
                    fontSize={20}
                    fill={textItem.color}
                    onClick={() => handleTextClick(index)}
                    onDragEnd={(e) => handleEndDrag(e, index)}
                  />
                ))}
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.color}
                    strokeWidth={2}
                    tension={0.5}
                    lineCap="round"
                  />
                ))}
              </Layer>
            </Stage>
          )}
          {/* edit Text Input */}
          {fileType === 'image' && (
            <>
              {activeTextIndex !== null && (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="absolute rounded-full bg-transparent p-3 text-xl text-white focus:outline-none"
                  style={{
                    left: texts[activeTextIndex].x,
                    top: texts[activeTextIndex].y,
                  }}
                  onBlur={handleTextChange}
                  autoFocus
                />
              )}

              {/* Add Text */}
              <div className="absolute left-2 top-2 flex items-center space-x-2">
                <button
                  onClick={handleAddText}
                  className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  T
                </button>
              </div>
              <div className="absolute right-2 top-2 space-x-3">
                <input
                  ref={colorRef}
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="hidden p-2"
                />
                <button onClick={handleInputColor}>
                  <IoColorPalette className="text-xl text-white" />
                </button>
                <button
                  onClick={() => setActiveDraw((prev) => !prev)}
                  className={`rounded-full ${activeDraw ? 'bg-blue-800' : 'bg-blue-500'} px-4 py-2 text-white hover:bg-blue-800`}
                >
                  <IoBrush />
                </button>
                <button
                  onClick={() => setLines([])}
                  className={`rounded-full bg-red-200 px-4 py-2 text-white hover:bg-red-400`}
                >
                  <IoTrash />
                </button>
              </div>
            </>
          )}
          <div
            className={`absolute ${fileType === 'video' ? 'bottom-[-35px]' : 'bottom-0'} left-0 flex w-full flex-row items-center justify-between p-2`}
          >
            <input
              type=""
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add caption"
              className="w-[80%] rounded-full border border-border bg-bg-secondary px-4 py-2 text-text-primary focus:outline-none"
              data-testid="caption-story-input"
            />
            <button
              onClick={handleExport}
              className={`rounded-full px-4 py-2 text-white ${isLoading ? 'bg-black' : 'bg-bg-button hover:bg-bg-button-hover'}`}
              disabled={isLoading}
              data-testid="upload-story-button"
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : (
                <IoArrowForward className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStoryOverlay;
