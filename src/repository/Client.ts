import axios from 'axios';
import { handleDates } from '../utils/DateInterceptor.ts';

// 1. Create the Shared Axios Instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REPOSITORY_URL,
    withCredentials: true
});

// 2. Add your Date Interceptor (and Auth interceptors if needed)
axiosInstance.interceptors.response.use((response) => {
    handleDates(response.data);
    return response;
});
