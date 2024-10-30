import { configureStore } from "@reduxjs/toolkit";

//import slices from './slices';

import authReducer from "./slices/authSlice";
import darkReducer from "./slices/darkModeSlice";
import sidebarReducer from "./slices/sidebarSlice";

const store = configureStore({
  reducer: {
    //slices
    auth: authReducer,
    darkMode: darkReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
