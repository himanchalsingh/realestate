import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://realestate-api-p4w4.onrender.com",
  withCredentials: true,
});

export default apiRequest;
