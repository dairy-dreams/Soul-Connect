import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCeSjBfoY7PQ0fkO-_nMx_kMARSi9ANbS8",
  authDomain: "chat-app-55d36.firebaseapp.com",
  projectId: "chat-app-55d36",
  storageBucket: "chat-app-55d36.firebasestorage.app",
  messagingSenderId: "270409569896",
  appId: "1:270409569896:web:cf7d0a66dc3b5bc59f0ddd",
  measurementId: "G-3F9PDYMSC1"
};

let app;
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
export { app };
