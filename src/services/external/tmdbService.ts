import axios from "axios";
import type { MovieResponseDTO } from "@/dto/MovieDTO";
import type {
	MovieCreditsDTO,
	MovieDetailDTO,
	MovieImagesDTO,
	MovieReviewsResponseDTO,
	MovieVideosDTO,
} from "@/dto/MovieDetailDTO";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export const tmdbApi = axios.create({
	baseURL: TMDB_BASE,
	timeout: 10000,
	headers: {
		accept: "application/json",
	},
});
const defaultParams = {
	api_key: TMDB_API_KEY,
	language: "en-US",
};

export async function getPopularMovies(page = 1): Promise<MovieResponseDTO> {
	const res = await tmdbApi.get(`/movie/popular`, {
		params: { ...defaultParams, page },
	});
	return res.data;
}

export async function getMovieDetail(movieId: number): Promise<MovieDetailDTO> {
	const res = await tmdbApi.get(`/movie/${movieId}`, {
		params: defaultParams,
	});
	return res.data;
}

export async function searchMovies(
	query: string,
	page = 1
): Promise<MovieResponseDTO> {
	const res = await tmdbApi.get(`/search/movie`, {
		params: { ...defaultParams, query, page },
	});
	return res.data;
}

export async function getMovieVideos(movieId: number): Promise<MovieVideosDTO> {
	const res = await tmdbApi.get(`/movie/${movieId}/videos`, {
		params: defaultParams,
	});
	return res.data;
}

export async function getSimilarMovies(
	movieId: number
): Promise<MovieResponseDTO> {
	const res = await tmdbApi.get(`/movie/${movieId}/similar`, {
		params: defaultParams,
	});
	return res.data;
}

export async function getMovieCredits(
	movieId: number
): Promise<MovieCreditsDTO> {
	const res = await tmdbApi.get(`/movie/${movieId}/credits`, {
		params: defaultParams,
	});
	return res.data;
}

export async function getMovieReviews(
	movieId: number
): Promise<MovieReviewsResponseDTO> {
	const res = await tmdbApi.get(`/movie/${movieId}/reviews`, {
		params: defaultParams,
	});
	return res.data;
}

export async function getMovieImages(movieId: number): Promise<MovieImagesDTO> {
	const res = await tmdbApi.get(`/movie/${movieId}/images`, {
		params: defaultParams,
	});
	return res.data;
}
