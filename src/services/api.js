import axios from "axios";

const api = axios.create({
  baseURL: "https://chocolicious-api.onrender.com/api"
});

export default api;