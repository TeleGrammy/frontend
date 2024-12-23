import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import AuthCallback from './components/registration/AuthCallback';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
// import { onMessage } from 'firebase/messaging';

import { SocketProvider } from './contexts/SocketContext';
import { useFirebase } from './contexts/FirebaseContext';
import { CallProvider } from './contexts/CallContext';

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

  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem('user'))?.isAdmin,
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AuthCallback setIsAdmin={setIsAdmin} />} />
        <Route path="/auth/*" element={<Auth setIsAdmin={setIsAdmin} />} />
        <Route
          path="/home"
          element={
            isAdmin ? (
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            ) : (
              <ProtectedRoute>
                <SocketProvider>
                  <CallProvider>
                    <Home />
                  </CallProvider>
                </SocketProvider>
              </ProtectedRoute>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
