import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import axios from 'axios'; // Import raw axios for the handshake

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine the correct Base URL dynamically
  const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    return `http://${window.location.hostname}:8000`;
  };

  // Unified Login Function
  const loginWithGoogle = async () => {
    try {
      let user;

      // 1. Perform Firebase Login (Web or Mobile)
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle();
        const credential = GoogleAuthProvider.credential(result.credential.idToken);
        const userCred = await signInWithCredential(auth, credential);
        user = userCred.user;
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        user = result.user;
      }

      // 2. Get the JWT Token (idToken)
      const idToken = await user.getIdToken();

      // 3. Send to Backend to set Session Cookie
      // We use raw axios here to ensure 'withCredentials' is set for the cookie exchange
      const API_URL = getBaseUrl();
      
      await axios.post(
        `${API_URL}/auth/session-login`, 
        { idToken: idToken }, 
        { 
          withCredentials: true, // Crucial: allows backend to set the cookie
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log("Backend session established successfully");

    } catch (error) {
      console.error("Login failed", error);
      // If backend sync fails, sign out of Firebase to keep states consistent
      await signOut(auth);
      if (Capacitor.isNativePlatform()) {
        await FirebaseAuthentication.signOut();
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth); // Sign out of Firebase
      if (Capacitor.isNativePlatform()) {
        await FirebaseAuthentication.signOut(); // Clear native session
      }
      
      // Optional: Call backend to clear cookie
      // const API_URL = getBaseUrl();
      // await axios.post(`${API_URL}/auth/logout`);

    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};