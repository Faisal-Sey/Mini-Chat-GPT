import axios from "axios";
import {getUserData, resetUserInfo} from "../utils/helpers";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_DOMAIN,
    timeout: 10000,
});

export const axiosClientWithHeaders = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_DOMAIN,
    timeout: 10000,
});

// Add a request interceptor
axiosClientWithHeaders.interceptors.request.use(
    (config) => {
        // Modify the request config before sending it
        const token = getUserData().access;

        // Add the token to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

axiosClientWithHeaders.interceptors.response.use(
    (response) => {
        // If the response is successful, return it as-is
        return response;
    },
    (error) => {
        // Check if the error response has a status code indicating token expiration (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            logoutUser();
        }
        // If it's not a token expiration error, pass the error along to the application
        return Promise.reject(error);
    }
);

// Function to log out the user
function logoutUser() {
    // reset user info
    resetUserInfo();
    window.location.href = "/";
}





