import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dataAPI = {
  fetchVisualizations: (filters, commodities) =>
    api.post("/visualizations", { filters, commodities }),
};

export default api;