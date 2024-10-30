import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    myStories:[
        {
            content: "Sample text related to image 1",
            media: "https://th.bing.com/th/id/OIP.9qDnDwjNhrwEkulBG3TvMgHaFj?w=208&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
            views: 10,
            expiresAt: "2030-12-1",
            Name: "John Doe",
            userId: 1
        },
        {
            content: "Sample text related to image 2",
            media: "https://th.bing.com/th/id/OIP.K8_O7juMTdNJH-m9w6DAvQHaJp?w=120&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
            views: 5,
            expiresAt: "2030-12-2",
            Name: "John M4 Doe",
            userId: 2
        },
    ],
    otherStories: [],
};

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setMyStories(state, action) {
        state.myStories = action.payload;
    },

    setOtherStories(state, action) {
        state.otherStories = action.payload;
    },
  },
});

export const { setMyStories, setOtherStories } = storiesSlice.actions;

export default storiesSlice.reducer;
