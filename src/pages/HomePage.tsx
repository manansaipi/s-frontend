import { useEffect, useState } from "react";
import { Spin, Card, Image, Modal, Tag } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { MovieDTO } from "@/dto/MovieDTO";
import {
	getPopularMovies,
	getMovieDetail,
} from "@/services/external/tmdbService";
import type { MovieDetailDTO } from "@/dto/MovieDetailDTO";

type ModalMovieData = {
	loading: boolean;
	data: MovieDetailDTO | null;
};

const HomePage = () => {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [movies, setMovies] = useState<MovieDTO[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [modalData, setModalData] = useState<ModalMovieData>({
		loading: false,
		data: null,
	});

	const handleSearch = async () => {
		if (!query.trim()) return;
		setLoading(true);

		try {
		} catch (err) {
			console.error("Failed to fetch movies", err);
		} finally {
			setLoading(false);
		}
	};

	const openMovieModal = async (movie: MovieDTO) => {
		setIsModalOpen(true);
		setModalData({ loading: true, data: null });

		try {
			const detail = await getMovieDetail(movie.id);

			setModalData({ loading: false, data: detail });
		} catch (err) {
			setModalData({ loading: false, data: null });
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

	const selectedMovie = modalData.data;

	return (
		<>
			<div className="flex flex-col items-center text-white px-4 text-center">
				{/* Hero section */}
				<div className="max-w-2xl mt-20">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Unlimited movies, TV shows, and more
					</h1>
					<p className="text-lg mb-2 ">
						Explore trending films and search your favorite movies instantly.
					</p>

					{/* Search box */}
					<div className="flex gap-2 items-center justify-center mt-2">
						<input
							placeholder="Search for a movie..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-100 rounded-md bg-transparent border border-gray-400 p-4  "
						/>
						<div className="text-xl font-semibold">
							<button
								onClick={handleSearch}
								className="bg-[#e50914] border-none p-3 rounded-md  px-7  "
							>
								<div className="flex items-center gap-2 ">
									<div>Search</div>
									<IoIosArrowForward size={25} />
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* TRANDING NOW */}
			<div className="mt-10 text-white ">
				{loading ? (
					<div className=" justify-center">
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

			{/* MODAL DETAIL MOVIE */}
			<Modal
				title=""
				centered
				closable={true}
				closeIcon={
					<span className="text-white text-3xl opacity-80 hover:opacity-100">
						&times;
					</span>
				}
				footer={null}
				open={isModalOpen}
				width={"40%"}
				onCancel={() => setIsModalOpen(false)}
				className="custom-modal-transparent-bg"
				styles={{
					content: {
						padding: 0,
						overflow: "hidden",
						borderRadius: "8px",
					},
					mask: {
						backdropFilter: "blur(5px)",
					},
				}}
				rootClassName="[&_.ant-modal-close]:top-4 [&_.ant-modal-close]:right-4 [&_.ant-modal-close]:z-50"
			>
				{/* Conditional Rendering inside the Modal */}
				{modalData.loading ? (
					// Show loading spinner while fetching data
					<div className="flex items-center justify-center h-[500px] bg-black">
						<Spin
							size="large"
							tip="Loading movie details..."
						/>
					</div>
				) : selectedMovie ? (
					// 4. Use dynamic data to populate the Modal
					<div
						className="relative w-full h-[500px] text-white p-6 flex flex-col justify-end"
						style={{
							backgroundImage: `url(https://image.tmdb.org/t/p/original${
								selectedMovie.backdrop_path || selectedMovie.poster_path
							})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
					>
						<div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent/50 to-black/30 z-10" />

						<div className="relative z-20 space-y-4">
							<h2 className="text-4xl font-extrabold tracking-tight">
								{selectedMovie.title}
							</h2>

							{/* Tags/Badges */}
							<div className="flex items-center space-x-2 text-sm font-semibold">
								{/* Release Year */}
								<span className="p-1 px-2 border border-white/50 rounded-md">
									{selectedMovie.release_date
										? new Date(selectedMovie.release_date).getFullYear()
										: "N/A"}
								</span>
								{/* Runtime */}
								{selectedMovie.runtime && (
									<span className="p-1 px-2 border border-white/50 rounded-md">
										{selectedMovie.runtime} min
									</span>
								)}
								{/* Genres */}
								{selectedMovie.genres.slice(0, 3).map((genre) => (
									<span
										key={genre.id}
										className="text-white/80"
									>
										{genre.name}
									</span>
								))}
							</div>

							{/* Description (Overview) */}
							<p className="text-lg font-light max-w-xl">
								{selectedMovie.overview ||
									selectedMovie.tagline ||
									"No summary available."}
							</p>

							{/* Get Started Button */}
							<button
								onClick={() =>
									alert(`Starting playback for ${selectedMovie.title}...`)
								}
								className="bg-[#e50914] text-white  py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-[#ff0a16] transition duration-200"
							>
								<div className="text-lg font-semibold">Get Started</div>
								<IoIosArrowForward size={25} />
							</button>
						</div>
					</div>
				) : (
					// Fallback for failed fetch/no data
					<div className="flex items-center justify-center h-[500px] bg-black text-white">
						<p>Could not load movie details. Please try again.</p>
					</div>
				)}
			</Modal>
		</>
	);
};

export default HomePage;
