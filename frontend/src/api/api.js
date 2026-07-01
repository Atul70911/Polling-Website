import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  withCredentials: true, 
});


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