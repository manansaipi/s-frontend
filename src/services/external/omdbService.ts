const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE = "https://www.omdbapi.com/";

export async function searchMovies(q: string, page = 1) {
	const res = await fetch(
		`${BASE}?apikey=${OMDB_KEY}&s=${encodeURIComponent(q)}&page=${page}`
	);
	return res.json();
}

export async function getMovieById(id: string) {
	const res = await fetch(`${BASE}?apikey=${OMDB_KEY}&i=${id}&plot=full`);
	return res.json();
}