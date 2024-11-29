import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myStories: [
    {
      content: 'Sample text related to image 1',
      media:
        'https://th.bing.com/th/id/OIP.9qDnDwjNhrwEkulBG3TvMgHaFj?w=208&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      views: 10,
      expiresAt: '2030-12-1',
      Name: 'John Doe',
      duration: 15,
      userId: 1,
    },
    {
      content: 'Sample text related to image 2',
      media:
        'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      views: 5,
      expiresAt: '2030-12-2',
      Name: 'John M4 Doe',
      duration: 10,
      userId: 2,
    },
  ],
  otherStories: [
    {
      userId: 1,
      stories: [
        {
          content: 'Sample text related to image 1',
          media:
            'https://th.bing.com/th/id/OIP.9qDnDwjNhrwEkulBG3TvMgHaFj?w=208&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 10,
          expiresAt: '2030-12-1',
          Name: 'John Doe',
          duration: 10,
          userId: 1,
        },
        {
          content: 'Sample text related to image 1',
          media:
            'https://th.bing.com/th/id/OIP.9qDnDwjNhrwEkulBG3TvMgHaFj?w=208&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 10,
          expiresAt: '2030-12-1',
          Name: 'John Doe',
          duration: 10,
          userId: 1,
        },
        {
          content: 'Sample text related to image 1',
          media:
            'https://th.bing.com/th/id/OIP.9qDnDwjNhrwEkulBG3TvMgHaFj?w=208&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 10,
          expiresAt: '2030-12-1',
          Name: 'John Doe',
          duration: 10,
          userId: 1,
        },
        {
          content: 'Sample text related to image 1',
          media:
            'https://th.bing.com/th/id/OIP.9qDnDwjNhrwEkulBG3TvMgHaFj?w=208&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 10,
          expiresAt: '2030-12-1',
          Name: 'John Doe',
          duration: 10,
          userId: 1,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    {
      userId: 2,
      stories: [
        {
          content: 'Sample text related to image 2',
          media:
            'https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
          views: 5,
          expiresAt: '2030-12-2',
          Name: 'John M4 Doe',
          duration: 7,
          userId: 2,
        },
      ],
    },
    
  ],
  showedMyStoryIndex: null,
  showedOtherStoryIndex: null,
  showedOtherUserIndex: null,
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setMyStories(state, action) {
      state.myStories = action.payload;
    },

    setOtherStories(state, action) {
      state.otherStories = action.payload;
    },

    setShowedMyStoryIndex(state, action) {
      state.showedMyStoryIndex = action.payload;
    },

    setShowedOtherStoryIndex(state, action) {
      state.showedOtherStoryIndex = action.payload;
    },

    setShowedOtherUserIndex(state, action) {
      state.showedOtherUserIndex = action.payload;
    },
  },
});

export const {
  setMyStories,
  setOtherStories,
  setShowedMyStoryIndex,
  setShowedOtherStoryIndex,
  setShowedOtherUserIndex,
} = storiesSlice.actions;

export default storiesSlice.reducer;
