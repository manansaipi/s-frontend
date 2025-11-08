import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import { searchMovies } from "@/services/external/tmdbService";
import type { MovieDTO } from "@/dto/MovieDTO";
import MovieDetailModal from "@/components/MovieDetailModal"; // Import reusable modal component

const SearchPage = () => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q") || "";

	const [results, setResults] = useState<MovieDTO[]>([]);
	const [loading, setLoading] = useState(false);

	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

	// Handlers for the reusable modal
	const openMovieModal = (movieId: number) => {
		setSelectedMovieId(movieId);
	};

	const closeMovieModal = () => {
		setSelectedMovieId(null);
	};

	useEffect(() => {
		const fetchSearchResults = async () => {
			if (!query) {
				setResults([]);
				return;
			}

			setLoading(true);
			try {
				const data = await searchMovies(query);
				// Filter out results without a poster path for a cleaner grid display
				setResults(data.results.filter((movie) => movie.poster_path));
			} catch (error) {
				console.error("Error fetching search results:", error);
				setResults([]);
			} finally {
				setLoading(false);
			}
		};

		fetchSearchResults();
	}, [query]);

	const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

	return (
		<div className="min-h-screen p-6 pt-20 text-white">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					{query ? `Results for "${query}"` : "More to explore"}
				</h1>
			</div>

			<hr className="mb-8 border-gray-800" />

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Spin
						size="large"
						tip="Searching..."
					/>
				</div>
			) : results.length === 0 ? (
				<p className="text-center text-gray-500">
					No results found for "{query}".
				</p>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{results.map((movie) => (
						<div
							key={movie.id}
							onClick={() => openMovieModal(movie.id)}
							className="relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
						>
							<img
								src={
									movie.poster_path
										? `${IMAGE_BASE_URL}${movie.poster_path}`
										: "/assets/no-image.jpg"
								}
								alt={movie.title}
								className="w-full h-auto aspect-2/3 object-cover"
								loading="lazy"
							/>
						</div>
					))}
				</div>
			)}

			<MovieDetailModal
				movieId={selectedMovieId}
				isVisible={!!selectedMovieId}
				onClose={closeMovieModal}
			/>
		</div>
	);
};

export default SearchPage;
