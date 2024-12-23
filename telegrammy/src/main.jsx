import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { FirebaseProvider } from './contexts/FirebaseContext';

import store from './store';
import App from './App';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </Provider>,
);
