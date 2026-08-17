import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ??
      err.message ??
      "Unexpected error. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export default api;
