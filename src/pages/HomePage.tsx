import { useEffect, useState } from "react";
import { Spin } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { MovieDTO } from "@/dto/MovieDTO";
import { getPopularMovies } from "@/services/tmdbService";
import { useNavigate } from "react-router-dom";
import MovieDetailModal from "@/components/MovieDetailModal";
import type { FavoriteOut } from "@/dto/FavoriteDTO";
import { getFavorites } from "@/services/internalService";

const HomePage = () => {
	const [favorites, setFavorites] = useState<FavoriteOut[]>([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [movies, setMovies] = useState<MovieDTO[]>([]);

	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

	const navigate = useNavigate();

	const handleSearch = () => {
		if (!query.trim()) return;
		navigate(`/search?q=${encodeURIComponent(query.trim())}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const openMovieModal = (movie: MovieDTO) => {
		setSelectedMovieId(movie.id);
	};

	const closeMovieModal = () => {
		setSelectedMovieId(null);
	};

	const fetchFavorites = async () => {
		try {
			const data = await getFavorites();
			setFavorites(data);
		} catch (err) {
			console.error("Error fetching favorites:", err);
			setFavorites([]);
		} finally {
		}
	};

	useEffect(() => {
		const fetchMovies = async () => {
			setLoading(true);
			try {
				const data = await getPopularMovies();
				setMovies(data.results.slice(0, 10)); // Show top 10 trending
			} catch (err) {
				console.error("Failed to fetch trending movies:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchMovies();
	}, []);

	return (
		<>
			<div className=" flex flex-col items-center text-white px-4 text-center pt-[15vh]">
				{/* Hero section */}
				<div className="max-w-2xl mt-20">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Unlimited movies, TV shows, and more
					</h1>
					<p className="text-lg mb-2 ">
						Explore trending films and search your favorite movies instantly.
					</p>

					{/* Search box */}
					<div className="flex gap-2 items-center justify-center mt-2 ">
						<input
							placeholder="Search for a movie..."
							value={query}
							onKeyDown={handleKeyDown}
							onChange={(e) => setQuery(e.target.value)}
							className="w-100 rounded-md bg-transparent border border-gray-400 p-4 "
						/>
						<div className="text-xl font-semibold ">
							<button
								onClick={handleSearch}
								className="bg-[#e50914] border-none p-3 rounded-md px-7 cursor-pointer"
							>
								<div className="flex items-center gap-2">
									<div>Search</div>
									<IoIosArrowForward size={25} />
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* TRANDING NOW */}
			<div className="mt-20 text-white ">
				{loading ? (
					<div className="flex justify-center items-center w-full">
						<Spin size="large" />
					</div>
				) : (
					<div className="text-white max-w-[100vw] ">
						<Carousel className="w-full max-w-screen-2xl mx-auto ">
							<div className="p-2 text-2xl font-semibold">Trending Now</div>
							<CarouselContent className="flex py-5 px-8">
								{movies.map((movie, index) => (
									<CarouselItem
										key={movie.id}
										className="relative basis-1/6 px-4 shrink-0 transform transition-transform duration-500 hover:scale-110 cursor-pointer"
										onClick={() => openMovieModal(movie)}
									>
										{/* Netflix-style number */}
										<div
											className="absolute -left-2 bottom-2 text-8xl font-black text-black leading-none
      [text-shadow:-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff,1px_1px_0_#fff]"
										>
											{index + 1}
										</div>

										{/* Movie image */}
										<div className="rounded-xl overflow-hidden h-[30vh]">
											<img
												src={
													movie.poster_path
														? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
														: "/assets/no-image.jpg"
												}
												alt={movie.title}
												className="w-full h-full object-cover"
											/>
										</div>

										{/* Movie title */}
										<p className="mt-2 text-sm font-semibold truncate text-center">
											{movie.title}
										</p>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>
				)}
			</div>

			<MovieDetailModal
				movieId={selectedMovieId}
				isVisible={!!selectedMovieId} // Modal is visible if selectedMovieId is set
				onClose={closeMovieModal}
				favorites={favorites}
				onFavoriteChange={fetchFavorites}
			/>
		</>
	);
};

export default HomePage;
