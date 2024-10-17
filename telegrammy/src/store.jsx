import { configureStore } from "@reduxjs/toolkit";

//import slices from './slices';

import loginReducer from "./slices/loginSlice";

const store = configureStore({
  reducer: {
    //slices
    login: loginReducer,
  },
});

export default store;
