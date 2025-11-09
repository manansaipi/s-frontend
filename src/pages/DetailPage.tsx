import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { FaPlay, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
	getMovieDetail,
	getMovieVideos,
	getSimilarMovies,
} from "@/services/tmdbService";
import type { MovieDetailDTO } from "@/dto/MovieDetailDTO";
import type { MovieDTO } from "@/dto/MovieDTO";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import MovieInfoModal from "@/components/MovieInfoModal";

const IMAGE_BASE_URL_W500 = "https://image.tmdb.org/t/p/w500";
const YOUTUBE_BASE_URL = "https://www.youtube.com/embed/";

const DetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const movieId = id ? parseInt(id, 10) : null;

	const [movieDetail, setMovieDetail] = useState<MovieDetailDTO | null>(null);
	const [videoKey, setVideoKey] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [popularMovies, setSimilarMovie] = useState<MovieDTO[]>([]);
	const [isMuted, setIsMuted] = useState(false);
	const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

	const toggleMute = () => setIsMuted((prev) => !prev);

	const videoUrl = videoKey
		? `${YOUTUBE_BASE_URL}${videoKey}?autoplay=1&mute=${
				isMuted ? 1 : 0
		  }&controls=0&loop=1&playlist=${videoKey}`
		: null;

	useEffect(() => {
		if (movieId === null || isNaN(movieId)) {
			setLoading(false);
			return;
		}

		const fetchDetailsAndVideos = async () => {
			setLoading(true);
			try {
				// Fetch basic details
				const detail = await getMovieDetail(movieId);
				setMovieDetail(detail);

				// Fetch videos (trailers/teasers)
				const videos = await getMovieVideos(movieId);

				// logic to find the best trailer key
				const trailer = videos.results.find(
					(v) => v.site === "YouTube" && v.type === "Trailer"
				);

				if (trailer) {
					setVideoKey(trailer.key);
				} else {
					setVideoKey(null);
				}
			} catch (err) {
				console.error("Failed to fetch movie details or videos:", err);
				setMovieDetail(null);
				setVideoKey(null);
			} finally {
				setLoading(false);
			}
		};

		const fetchSimilar = async () => {
			try {
				const data = await getSimilarMovies(movieId);
				setSimilarMovie(
					data.results.filter((movie) => movie.id !== movieId).slice(0, 10)
				);
			} catch (err) {
				console.error("Failed to fetch related movies:", err);
			}
		};

		fetchDetailsAndVideos();
		fetchSimilar();
	}, [movieId]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black">
				<Spin
					size="large"
					tip="Loading movie details..."
				/>
			</div>
		);
	}

	if (!movieDetail) {
		return (
			<div className="min-h-screen flex items-center justify-center text-white">
				<p>Movie not found or failed to load details.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-white w-full">
			<div className="relative w-full h-[80vh] flex flex-col justify-center px-8 overflow-hidden">
				{videoUrl ? (
					<div>
						<iframe
							key={movieId}
							className="absolute top-0 left-0 w-full h-screen  object-cover scale-135"
							src={videoUrl}
							allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
							title="Movie Trailer"
							allowFullScreen
						/>
						<button
							onClick={toggleMute}
							className="absolute right-8 bottom-8 z-30 p-3 rounded-full border border-gray-500 hover:border-white bg-opacity-10 text-white hover:bg-opacity-80 transition cursor-pointer"
							aria-label={isMuted ? "Unmute video" : "Mute video"}
						>
							{isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
						</button>
					</div>
				) : (
					<div> Not found</div>
				)}
				<div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-black/10 to-black" />

				<div className="absolute inset-0 z-10" />

				{/* Content Overlay */}
				<div className="z-20 max-w-xl space-y-6">
					<h1 className="text-6xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
						{movieDetail.title}
					</h1>

					<div className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
						<span className="p-1 px-2 border border-gray-500 rounded-md">
							IMDb {movieDetail.vote_average.toFixed(1)}
						</span>
						{movieDetail.runtime && (
							<span className="p-1 px-2 border border-gray-500 rounded-md">
								{movieDetail.runtime} min
							</span>
						)}
						<span className="p-1 px-2 border border-gray-500 rounded-md">
							{movieDetail.release_date
								? new Date(movieDetail.release_date).getFullYear()
								: "N/A"}
						</span>
					</div>

					<p className="text-lg font-light max-w-lg">
						{movieDetail.overview ||
							movieDetail.tagline ||
							"No synopsis available."}
					</p>

					<div className="flex gap-3 pt-4 cursor-pointer">
						<button
							onClick={() => console.log("Playing movie...")}
							className="flex items-center bg-white text-black text-lg font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition "
						>
							<FaPlay
								className="mr-3 text-black"
								size={20}
							/>
							<div className="text-black text-2xl">Play</div>
						</button>
						<button
							onClick={() => setIsInfoModalVisible(true)}
							className="flex items-center bg-[#38403d]  text-white text-lg font-bold py-3 px-6 rounded-md opacity-80 hover:opacity-50 transition cursor-pointer"
						>
							<IoMdInformationCircleOutline
								className="mr-2"
								size={28}
							/>
							<div className="text-2xl">More Info</div>
						</button>
					</div>
				</div>
			</div>

			{/* related Movies Section */}
			<div className=" w-full">
				{popularMovies.length === 0 ? (
					<p className="text-gray-500">No related movies found.</p>
				) : (
					<Carousel className="w-full max-w-[92vw] mx-auto ">
						<h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
						<CarouselContent className="flex py-5">
							{popularMovies.map((movie) => (
								<CarouselItem
									key={movie.id}
									className="relative basis-1/6 px-2 shrink-0 transform transition-transform duration-500 hover:scale-105 cursor-pointer"
									onClick={() => (window.location.href = `/movie/${movie.id}`)}
								>
									<div className="rounded-xl overflow-hidden h-[30vh]">
										<img
											src={
												movie.poster_path
													? `${IMAGE_BASE_URL_W500}${movie.poster_path}`
													: "/assets/no-image.jpg"
											}
											alt={movie.title}
											className="w-full h-full object-cover"
										/>
									</div>
									<p className="mt-2 text-sm font-semibold truncate text-center">
										{movie.title}
									</p>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				)}
			</div>

			<MovieInfoModal
				movieId={movieId}
				movieDetail={movieDetail}
				isVisible={isInfoModalVisible}
				onClose={() => setIsInfoModalVisible(false)}
			/>
		</div>
	);
};

export default DetailPage;
