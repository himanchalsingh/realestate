import axios from "axios";

const apiRequest = axios.create({
  baseURL: "realestate-seven-pi.vercel.app",
  withCredentials: true,
});

export default apiRequest;
