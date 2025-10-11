// import axios from 'axios'

// const apiClient = axios.create({
//     baseURL:import.meta.env.VITE_API_BASE_URL,
//     withCredentials:true, //for sending cookies
// })
// apiClient.interceptors.response.use(
//   (response) => {
//     // If the response is successful (status 2xx), just return it.
//     return response;
//   },
//   (error) => {
//     // If the server responds with an error, check if it's a 401 Unauthorized.
//     if (error.response && error.response.status === 401) {
//       // This means the user's token is missing, invalid, or expired.
//       // We force a redirect to the login page. This is a simple and
//       // robust way to handle session termination.
//       window.location.href = '/login';
//     }

//     // For any other errors, we let the promise reject normally.
//     return Promise.reject(error);
//   }
// );
// export default apiClient

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
    // If there's an error during request setup, reject the promise
    return Promise.reject(error);
  }
);


// --- Axios Response Interceptor ---
// This runs AFTER a response is received.

apiClient.interceptors.response.use(
  (response) => {
    // 1. Handle SUCCESSFUL responses (status 2xx)
    
    // Check if the server sent a new access token in the custom header
    const newAccessToken = response.headers['x-access-token'];
    if (newAccessToken) {
      console.log('Token was refreshed. Updating stored token.');
      setToken(newAccessToken);
    }
    
    // Return the successful response to the original caller
    return response;
  },
  (error) => {
    // 2. Handle ERROR responses
    
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      // This means both the access token and refresh token have failed.
      // The session is truly over.
      console.error('Unauthorized! Redirecting to login.');
      
      // Clear any stale token from storage
      removeToken();
      
      // Redirect to the login page
      // Using location.href will force a full page reload, clearing any component state.
      window.location.href = '/login';
    }

    // For any other errors, let the promise reject normally
    return Promise.reject(error);
  }
);

export default apiClient;