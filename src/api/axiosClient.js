// src/api/axiosClient.js
import axios from 'axios';
import { auth } from '../firebase'; // Import Firebase auth

// Helper to determine the correct Base URL dynamically
const getBaseUrl = () => {
  // 1. If explicitly set in .env, use that
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // 2. Dynamic Fallback:
  // If you are on localhost, it points to localhost:8000
  // If you are on 192.168.1.11, it points to 192.168.1.11:8000
  return `http://${window.location.hostname}:8000`;
};

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // Crucial for cookie-based sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 1. Request Interceptor (Robust Token Attachment) ---
axiosClient.interceptors.request.use(
  async (config) => {
    // 1. Check if a user is currently logged in via Firebase SDK
    const user = auth.currentUser;

    if (user) {
      try {
        // 2. FORCE a fresh token retrieval. 
        // passing 'true' forces a refresh, ensuring we don't send a stale/expired token.
        const token = await user.getIdToken(true);
        
        // 3. Attach to headers
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error fetching auth token", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. Response Interceptor (Error Handling) ---
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      // Handle 401 specifically
      if (response.status === 401) {
        console.error('Unauthorized! Token might be invalid or missing.');
        // Optional: Logic to logout user if session is invalid
        // window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;