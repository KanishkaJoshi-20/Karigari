import axios from "axios";

// Default base URL for API
const API_URL = import.meta.env.VITE_API_URL || "https://karigari-1.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("userToken");
    if (!token) {
      const rawUser = localStorage.getItem("userInfo");
      if (rawUser) {
        try {
          const parsedUser = JSON.parse(rawUser);
          token = parsedUser?.token || token;
        } catch {
          token = null;
        }
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
