import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";


const firebaseApp = initializeApp({
    apiKey: 'AIzaSyC0zLXiBij35Gc7XAj7pTWqFZNQldpIJc8',
    authDomain: 'telegrammy-sw.firebaseapp.com',
    projectId: 'telegrammy-sw',
    storageBucket: 'telegrammy-sw.firebasestorage.app',
    messagingSenderId: '49270575708',
    appId: '1:49270575708:web:6347dae0eed5f547510c99',
    measurementId: 'G-YK1QJ7MXT4',
});


const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});