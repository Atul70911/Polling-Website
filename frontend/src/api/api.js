import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://polling-website-28iv.onrender.com/api/v1",
  withCredentials: true, // required if backend uses httpOnly cookies
});