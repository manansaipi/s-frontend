import axios from "axios";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";
const TMDB_BASE = "https://api.themoviedb.org/3";

export const internalApi = axios.create({
	baseURL: BACKEND_BASE,
	timeout: 10000,
});
export const tmdbApi = axios.create({
	baseURL: TMDB_BASE,
	timeout: 10000,
	headers: { accept: "application/json" },
});
