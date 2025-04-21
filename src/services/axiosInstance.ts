import axios from "axios";
import storageService from "./storageService";

const instance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  }
});

instance.interceptors.request.use(config => {
  const token = storageService.getJwtToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      console.warn("🔒 Unauthorized. Redirecting or handling globally.");
    }

    return Promise.reject(error);
  }
);

export default instance;
