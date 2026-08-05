

import axios from 'axios';

// --- Token Management Helpers ---
// These functions centralize how you get and set the token in localStorage.

const getToken = () => localStorage.getItem('accessToken');

const setToken = (token) => localStorage.setItem('accessToken', token);

const removeToken = () => localStorage.removeItem('accessToken');


// --- Axios Client Setup ---

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // This is crucial for sending the httpOnly refresh token cookie
});


// --- Axios Request Interceptor ---
// This runs BEFORE every request is sent.

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // If a token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Continue with the request
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- Axios Response Interceptor ---

apiClient.interceptors.response.use(
  (response) => {
    
    // Check if the server sent a new access token in the custom header
    const newAccessToken = response.headers['x-access-token'];
    // console.log("new access token is \n", newAccessToken)
    if (newAccessToken) {
      console.log('Token was refreshed. Updating stored token.');
      setToken(newAccessToken);
    }
    
    // Return the successful response to the original caller
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {


      console.error('Unauthorized! Redirecting to login.');
      

      removeToken();
      localStorage.clear();
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default apiClient;