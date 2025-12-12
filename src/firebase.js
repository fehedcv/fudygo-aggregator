// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// REPLACE THIS WITH YOUR CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {

  apiKey: "AIzaSyC76kUJmigd9wrifYHVimZtl-KtgtoLGFE",

  authDomain: "fudy-go.firebaseapp.com",

  projectId: "fudy-go",

  storageBucket: "fudy-go.firebasestorage.app",

  messagingSenderId: "18751371923",

  appId: "1:18751371923:web:3e684b446ce14eea3c6b66",

  measurementId: "G-EP6PH64HME"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();