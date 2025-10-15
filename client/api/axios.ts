import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://51.21.202.4"
    : "http://localhost:8000";
const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("refreshtoken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.status === 200 || response?.status === 201) {
      const message = response?.data?.message;
      if (message && message.trim() !== "") {
        toast.success(message);
      }
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized → redirecting to login...", error);
      toast.error(
        typeof error.response?.data === "object" && error.response?.data !== null && "message" in error.response.data
          ? (error.response.data as { message?: string }).message
          : "An error occurred"
      )
    }
    if (error.response?.status === 400) {
      toast.error(
        typeof error.response?.data === "object" && error.response?.data !== null && "message" in error.response.data
          ? (error.response.data as { message?: string }).message
          : "An error occurred"
      )
    }
    if (error.response?.status === 409) {
      toast.error(
        typeof error.response?.data === "object" && error.response?.data !== null && "message" in error.response.data
          ? (error.response.data as { message?: string }).message
          : "An error occurred"
      )
    }
    return Promise.reject(error);
  }
);

export default api;
