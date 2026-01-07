import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine the correct Base URL dynamically
  const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    try {
      const hostname = window?.location?.hostname || '';
      if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:8000';
    } catch (e) {
      // ignore
    }
    return 'http://10.0.2.2:8000';
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

      // 2. We use Firebase ID tokens on every API request (attached by axiosClient).
      // No cookie/session exchange is performed. The app is stateless.
      // The `onAuthStateChanged` listener below will set `currentUser`.

    } catch (error) {
      console.error("Login failed", error);
      // Ensure local/native Firebase sessions are cleared on error
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
      
      // Stateless mode: no server cookie to clear.

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