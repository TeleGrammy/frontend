import { configureStore } from '@reduxjs/toolkit';

//import slices from './slices';

import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    //slices
    auth: authReducer,
  },
});

export default store;
