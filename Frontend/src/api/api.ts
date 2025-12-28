import axios, { type AxiosInstance } from "axios";
import { STORAGE_KEYS } from "../constants/appConstants";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5145/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
