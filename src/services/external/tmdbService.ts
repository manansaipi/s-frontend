import axios from "axios";
import type { MovieResponseDTO } from "@/dto/MovieDTO";
import type { MovieDetailDTO } from "@/dto/MovieDetailDTO";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export const tmdbApi = axios.create({
	baseURL: TMDB_BASE,
	timeout: 10000,
	headers: {
		accept: "application/json",
	},
});

export async function getPopularMovies(page = 1): Promise<MovieResponseDTO> {
	const res = await tmdbApi.get(`/movie/popular`, {
		params: {
			api_key: TMDB_API_KEY,
			language: "en-US",
			page,
		},
	});
	return res.data;
}

export async function getMovieDetail(movieId: number): Promise<MovieDetailDTO> {
	const res = await tmdbApi.get(`/movie/${movieId}`, {
		params: {
			api_key: TMDB_API_KEY,
			language: "en-US",
		},
	});
	return res.data;
}

export async function searchMovies(
	query: string,
	page = 1
): Promise<MovieResponseDTO> {
	const res = await tmdbApi.get(`/search/movie`, {
		params: {
			api_key: TMDB_API_KEY,
			language: "en-US",
			query: query, // Pass the search query
			page,
		},
	});
	return res.data;
}
