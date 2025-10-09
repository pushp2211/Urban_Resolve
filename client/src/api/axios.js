import axios from 'axios'

const apiClient = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true, //for sending cookies
})
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful (status 2xx), just return it.
    return response;
  },
  (error) => {
    // If the server responds with an error, check if it's a 401 Unauthorized.
    if (error.response && error.response.status === 401) {
      // This means the user's token is missing, invalid, or expired.
      // We force a redirect to the login page. This is a simple and
      // robust way to handle session termination.
      window.location.href = '/login';
    }

    // For any other errors, we let the promise reject normally.
    return Promise.reject(error);
  }
);
export default apiClient