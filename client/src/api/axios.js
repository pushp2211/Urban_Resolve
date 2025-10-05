import axios from 'axios'

const apiClient = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true, //for sending cookies
})

export default apiClient