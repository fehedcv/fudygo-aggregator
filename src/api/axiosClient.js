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
  import.meta.env.VITE_API_URL || 'https://fudygo-akfbczbwbdg3cydc.southeastasia-01.azurewebsites.net';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------
// REQUEST INTERCEPTOR
// ----------------------------------------------------
// Attach Firebase ID token as a Bearer token for authenticated requests.
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to attach Firebase token to request', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------------------------------
// RESPONSE INTERCEPTOR
// ----------------------------------------------------
// On 401: try a single token refresh and retry the request once.
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
          const freshToken = await user.getIdToken(true);
          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return axiosClient(originalRequest);
        }
      } catch (retryError) {
        console.warn('Token refresh and retry failed', retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
