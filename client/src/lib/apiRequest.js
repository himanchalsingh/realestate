import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://realestate-4-dctn.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
