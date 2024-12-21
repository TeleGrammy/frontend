import React, { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyC0zLXiBij35Gc7XAj7pTWqFZNQldpIJc8",
  authDomain: "telegrammy-sw.firebaseapp.com",
  projectId: "telegrammy-sw",
  storageBucket: "telegrammy-sw.firebasestorage.app",
  messagingSenderId: "49270575708",
  appId: "1:49270575708:web:6347dae0eed5f547510c99",
  measurementId: "G-YK1QJ7MXT4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);


const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");

  } else {
    console.error("Notification permission denied.");
  }
};

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ auth, db, messaging, generateToken }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
