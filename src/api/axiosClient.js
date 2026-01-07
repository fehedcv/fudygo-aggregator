// src/api/axiosClient.js
import axios from 'axios';
import { auth } from '../firebase';

// ----------------------------------------------------
// BASE URL
// ----------------------------------------------------
// With `adb reverse tcp:8000 tcp:8000`
// localhost works for:
// - Browser
// - Android phone (USB)
// - Capacitor WebView
// ----------------------------------------------------

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ----------------------------------------------------
// AXIOS INSTANCE
// ----------------------------------------------------

const axiosClient = axios.create({
  baseURL: BASE_URL,
  // Stateless token-based auth: do NOT use cookies or withCredentials
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------
// REQUEST INTERCEPTOR
// ----------------------------------------------------
// Attach Firebase ID token as a Bearer token for authenticated requests.
// This centralizes the logic so callers do not need to manage tokens manually.
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Non-forced retrieval: uses cached token when valid.
        const token = await user.getIdToken();
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // If token fetch fails, proceed without Authorization header.
      console.warn('Failed to attach Firebase token to request', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------
// RESPONSE INTERCEPTOR
// ----------------------------------------------------
// On 401: try a single token refresh (getIdToken(true)) and retry the request once.
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const user = auth.currentUser;
        if (user) {
          // Force refresh token and retry
          const freshToken = await user.getIdToken(true);
          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return axiosClient(originalRequest);
        }
      } catch (retryError) {
        // If refresh or retry fails, fall through and reject
        console.warn('Token refresh and retry failed', retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
