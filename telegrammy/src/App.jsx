import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './pages/Home';
import AuthCallback from './components/registration/AuthCallback';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
// import { onMessage } from 'firebase/messaging';

import { SocketProvider } from './contexts/SocketContext';
import { useFirebase } from './contexts/FirebaseContext';

export default function App() {
  const { generateToken, messaging } = useFirebase();

  useEffect(() => {
    const getTokens = async () => {
      const notificationToken = await generateToken();
      if (notificationToken !== null) {
        localStorage.setItem('notificationToken', notificationToken);
      }
    };

    getTokens();

    // onMessage(messaging, (payload) => {
    //   console.log('Message received. ', payload);
    // });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AuthCallback />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <SocketProvider>
                <Home />
              </SocketProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* <AdminDashboard/> */}
    </BrowserRouter>
  );
}
