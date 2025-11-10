import axios from "axios";

const BACKEND_BASE =
	import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";
const TMDB_BASE = "https://api.themoviedb.org/3";

export const internalApi = axios.create({
	baseURL: BACKEND_BASE,
	timeout: 10000,
});
// configuration to use send the token to the backendapi
internalApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
export const tmdbApi = axios.create({
	baseURL: TMDB_BASE,
	timeout: 10000,
	headers: { accept: "application/json" },
});
