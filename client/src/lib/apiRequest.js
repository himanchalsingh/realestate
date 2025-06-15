import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://realestate-1-g882.onrender.com",
  withCredentials: true,
});

export default apiRequest;
