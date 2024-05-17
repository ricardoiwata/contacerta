// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Altere para a URL do seu backend
});

export default api;
