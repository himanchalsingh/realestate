import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://realestate-api-sad8.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
