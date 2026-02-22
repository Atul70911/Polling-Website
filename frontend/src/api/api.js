import axios from "axios";

export const api = axios.create({
  baseURL:"https://polling-website-28iv.onrender.com/api/v1",
  withCredentials: true, // required if backend uses httpOnly cookies
});