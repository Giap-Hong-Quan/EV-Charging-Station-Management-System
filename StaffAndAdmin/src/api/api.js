import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // ví dụ backend của bạn
});

export default api;