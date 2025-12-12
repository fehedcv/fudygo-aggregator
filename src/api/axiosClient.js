// src/api/axiosClient.js
import axios from 'axios';
import { auth } from '../firebase'; // Import Firebase auth

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Ensure this matches your backend port
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