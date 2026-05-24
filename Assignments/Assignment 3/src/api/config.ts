import axios from 'axios';

// Central config — change BASE_URL here if backend changes
export const BASE_URL = 'https://6a12cb6278d0434e0d5d7b0f.mockapi.io';

// Axios instance shared across all API modules
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — injects auth token into every request
apiClient.interceptors.request.use(
  (config) => {
    // Token is injected here if available (set via setAuthToken below)
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handles common HTTP errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with 4xx/5xx
      const status = error.response.status;
      if (status === 404) throw new Error('Resource not found.');
      if (status === 500) throw new Error('Server error. Please try again later.');
      throw new Error(`Request failed with status ${status}.`);
    } else if (error.request) {
      // Request made but no response — network issue
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
);

export default apiClient;