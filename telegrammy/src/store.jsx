import { configureStore } from "@reduxjs/toolkit";

//import slices from './slices';

import authReducer from "./slices/authSlice";
import darkReducer from "./slices/darkModeSlice";

const store = configureStore({
  reducer: {
    //slices
    auth: authReducer,
    darkMode: darkReducer,
  },
});

export default store;
