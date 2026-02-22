import axios from "axios";

export const api = axios.create({
  baseURL: "https://polling-website-28iv.onrender.com/api/v1",
  withCredentials: true, 
});

// ✅ ADD THIS INTERCEPTOR
// It automatically grabs the token from localStorage and adds it to the headers of EVERY request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Don't append if it says "undefined" literally
      if (token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);