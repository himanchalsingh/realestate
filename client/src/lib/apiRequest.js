// import axios from "axios";

// const apiRequest = axios.create({
//   baseURL: "http://localhost:8800/api",
//   withCredentials: true,
// });

// export default apiRequest;
import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8800/api",
  withCredentials: true,
});

// Optional: Request interceptor (for setting auth headers if needed)
apiRequest.interceptors.request.use(
  (config) => {
    // Example: If you want to add auth header manually from localStorage
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor (for global error handling)
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiRequest;
