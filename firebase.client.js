// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';



// let app;
// let auth;
// let db;

// try {
//   if (!getApps().length) {
//     app = initializeApp(firebaseConfig);
//   } else {
//     app = getApp();
//   }

//   try {
//     auth = initializeAuth(app, {
//       persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//     });
//   } catch (authError) {
//     console.error("Auth initialization error:", authError);
//   }
//   db = getFirestore(app);
// } catch (error) {
//   console.error("Firebase initialization error:", error);
// }

// export { app, auth, db };

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCeSjBfoY7PQ0fkO-_nMx_kMARSi9ANbS8",
  authDomain: "chat-app-55d36.firebaseapp.com",
  projectId: "chat-app-55d36",
  storageBucket: "chat-app-55d36.firebasestorage.app",
  messagingSenderId: "270409569896",
  appId: "1:270409569896:web:cf7d0a66dc3b5bc59f0ddd",
  measurementId: "G-3F9PDYMSC1"
};

let auth;
let db;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

try {
  auth = firebase.auth();
  if (!auth) {
    auth = initializeAuth(firebase.app(), {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  console.error("Auth initialization error:", error);
}

db = firebase.firestore();

export { firebase, auth, db };
