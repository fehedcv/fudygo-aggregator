import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Unified Google Login
   * - Web → Firebase popup
   * - Native → Capacitor Firebase plugin
   */
  const loginWithGoogle = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Native (Android / iOS)
        const result = await FirebaseAuthentication.signInWithGoogle();
        const credential = GoogleAuthProvider.credential(
          result.credential.idToken
        );
        await signInWithCredential(auth, credential);
      } else {
        // Web
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error("Google login failed:", error);

      // Hard reset auth state on failure
      try {
        await signOut(auth);
        if (Capacitor.isNativePlatform()) {
          await FirebaseAuthentication.signOut();
        }
      } catch (_) {
        // ignore cleanup errors
      }

      throw error;
    }
  };

  /**
   * Unified Logout
   */
  const logout = async () => {
    try {
      await signOut(auth);
      if (Capacitor.isNativePlatform()) {
        await FirebaseAuthentication.signOut();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  /**
   * Auth state listener
   * This is the SINGLE source of truth for user state
   */
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
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
