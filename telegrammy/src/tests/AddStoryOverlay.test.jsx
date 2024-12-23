import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom'; // For matchers like toBeInTheDocument
import AddStoryOverlay from '../components/home/rightSidebar/AddStoryOverlay';
import js from '@eslint/js';

global.fetch = jest.fn();

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-konva', () => {
  const React = require('react'); // Import React within the mock factory
  return {
    Stage: React.forwardRef(({ children }, ref) => {
      // Mock the stageRef with required methods
      if (ref) {
        ref.current = {
          getStage: () => ({
            container: () => ({
              clientWidth: 500,
              clientHeight: 500,
            }),
          }),
          toDataURL: () => 'data:image/png;base64,mockedImageData', // Mock toDataURL
        };
      }
      return <div>{children}</div>;
    }),
    Layer: ({ children }) => <div>{children}</div>,
    Image: () => <div>Image</div>,
    Text: () => <div>Text</div>,
    Line: () => <div>Line</div>,
  };
});

describe('AddStoryOverlay Component', () => {
  const mockOnClose = jest.fn();
  const mockFile = new File(['dummy content'], 'test-image.png', {
    type: 'image/png',
  });
  const mockPreviewUrl = 'data:image/png;base64,...';

  beforeEach(() => {
    jest.clearAllMocks();

    //Global fetch mock setup
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        blob: jest
          .fn()
          .mockResolvedValue(
            new Blob(['mocked content'], { type: 'image/png' }),
          ),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ message: 'Success' }),
      });

    // Suppress warnings in the console
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly with necessary elements', () => {
    render(
      <AddStoryOverlay
        file={mockFile}
        previewUrl={mockPreviewUrl}
        onClose={mockOnClose}
        fileType="image"
      />,
    );

    expect(screen.getByTestId('caption-story-input')).toBeInTheDocument();
    expect(screen.getByTestId('upload-story-button')).toBeInTheDocument();
    expect(
      screen.getByTestId('close-story-overlay-button'),
    ).toBeInTheDocument();
  });

  it('calls the onClose function when the close button is clicked', () => {
    render(
      <AddStoryOverlay
        file={mockFile}
        previewUrl={mockPreviewUrl}
        onClose={mockOnClose}
        fileType="image"
      />,
    );

    fireEvent.click(screen.getByTestId('close-story-overlay-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('updates the caption input when typed into', () => {
    render(
      <AddStoryOverlay
        file={mockFile}
        previewUrl={mockPreviewUrl}
        onClose={mockOnClose}
        fileType="image"
      />,
    );

    const captionInput = screen.getByTestId('caption-story-input');
    fireEvent.change(captionInput, { target: { value: 'New Caption' } });
    expect(captionInput.value).toBe('New Caption');
  });

  it('uploads a story successfully', async () => {
    render(
      <AddStoryOverlay
        file={mockFile}
        previewUrl={mockPreviewUrl}
        onClose={mockOnClose}
        fileType="image"
      />,
    );

    const uploadButton = screen.getByTestId('upload-story-button');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('displays an error if the upload fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <AddStoryOverlay
        file={mockFile}
        previewUrl={mockPreviewUrl}
        onClose={mockOnClose}
        fileType="image"
      />,
    );

    const uploadButton = screen.getByTestId('upload-story-button');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
