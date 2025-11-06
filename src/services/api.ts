import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

const api = axios.create({
	baseURL: BACKEND,
	timeout: 10000,
});

export default api;
