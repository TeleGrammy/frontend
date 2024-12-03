import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import AddStory from '../components/home/rightSidebar/AddStory'; // Import your component
import '@testing-library/jest-dom'; // For matchers like toBeInTheDocument
// import AddStoryOverlay from '../components/home/rightSidebar/AddStoryOverlay';

jest.mock('../components/home/rightSidebar/AddStoryOverlay', () => {
  return ({ file, previewUrl, onClose, fileType }) => (
    <div data-testid="add-story-overlay">
      <p data-testid="FileType">File Type: {fileType}</p>
      <p data-testid="PreviewURL">Preview URL: {previewUrl}</p>
      <button onClick={onClose} data-testid="close-overlay-button">
        Close
      </button>
    </div>
  );
});

describe('AddStory Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    global.URL.createObjectURL = jest.fn(() => 'mockedObjectUrl');
    global.URL.revokeObjectURL = jest.fn();

    // Suppress warnings in the console
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    // Clean up the mock after tests
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  it('renders the Add Story button', () => {
    render(<AddStory />);
    expect(screen.getByTestId('add-story-button')).toBeInTheDocument();
  });

  it('opens the file input when Add Story button is clicked', () => {
    render(<AddStory />);
    const fileInput = screen.getByTestId('add-story-file-input');
    const addStoryButton = screen.getByTestId('add-story-button');

    jest.spyOn(fileInput, 'click'); // Mock the file input's click function
    fireEvent.click(addStoryButton);
    expect(fileInput.click).toHaveBeenCalled();
  });

  it('handles image file selection and shows the overlay', async () => {
    render(<AddStory />);
    const fileInput = screen.getByTestId('add-story-file-input');

    const mockFile = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });

    fireEvent.change(fileInput, {
      target: { files: [mockFile] },
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-story-overlay')).toBeInTheDocument();
    });

    expect(screen.getByTestId('FileType')).toBeInTheDocument();
    expect(screen.getByTestId('PreviewURL')).toBeInTheDocument();
  });

  it('handles video file selection under 100MB and shows the overlay', async () => {
    render(<AddStory />);
    const fileInput = screen.getByTestId('add-story-file-input');

    const mockVideoFile = new File(['dummy content'], 'test-video.mp4', {
      type: 'video/mp4',
    });
    Object.defineProperty(mockVideoFile, 'size', { value: 50 * 1024 * 1024 }); // Set file size to 50MB

    fireEvent.change(fileInput, {
      target: { files: [mockVideoFile] },
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-story-overlay')).toBeInTheDocument();
    });

    expect(screen.getByTestId('FileType')).toBeInTheDocument();
    expect(screen.getByTestId('PreviewURL')).toBeInTheDocument();
  });

  it('rejects video file larger than 100MB and does not show the overlay', async () => {
    window.alert = jest.fn(); // Mock alert

    render(<AddStory />);
    const fileInput = screen.getByTestId('add-story-file-input');

    const mockLargeVideoFile = new File(['dummy content'], 'large-video.mp4', {
      type: 'video/mp4',
    });
    Object.defineProperty(mockLargeVideoFile, 'size', {
      value: 150 * 1024 * 1024,
    }); // Set file size to 150MB

    fireEvent.change(fileInput, {
      target: { files: [mockLargeVideoFile] },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('add-story-overlay')).not.toBeInTheDocument();
    });

    expect(window.alert).toHaveBeenCalledWith(
      'Video file is too large. Please select a file under 100 MB.',
    );
  });

  it('closes the overlay when the close button is clicked', async () => {
    render(<AddStory />);
    const fileInput = screen.getByTestId('add-story-file-input');

    const mockFile = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });

    fireEvent.change(fileInput, {
      target: { files: [mockFile] },
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-story-overlay')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('close-overlay-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('add-story-overlay')).not.toBeInTheDocument();
    });
  });
});
