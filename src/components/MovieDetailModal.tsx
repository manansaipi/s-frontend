import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { getMovieDetail } from "@/services/external/tmdbService";
import type { MovieDetailDTO } from "@/dto/MovieDetailDTO";
import { useNavigate } from "react-router-dom";

// Define props for the reusable modal component
interface MovieDetailModalProps {
	movieId: number | null;
	isVisible: boolean;
	onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
	movieId,
	isVisible,
	onClose,
}) => {
	const navigate = useNavigate();
	const [modalData, setModalData] = useState<MovieDetailDTO | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isVisible || movieId === null) {
			setModalData(null); // Clsear data when hidden
			return;
		}

		const fetchDetail = async () => {
			setLoading(true);
			try {
				const detail = await getMovieDetail(movieId);
				setModalData(detail);
			} catch (err) {
				console.error("Failed to fetch movie details:", err);
				setModalData(null);
			} finally {
				setLoading(false);
			}
		};
		fetchDetail();
	}, [isVisible, movieId]);

	const handleGetStarted = () => {
		onClose();
		// You can navigate to a detailed view of the movie if needed
		navigate(`/movie/${movieId}`);
	};

	const selectedMovie = modalData;

	return (
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
			open={isVisible}
			// Use responsive width, adjusting to 60% for large screens
			width={"60%"}
			onCancel={onClose}
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
			{loading ? (
				// Show loading spinner while fetching data
				<div className="flex items-center justify-center h-[500px] bg-black">
					<Spin
						size="large"
						tip="Loading movie details..."
					/>
				</div>
			) : selectedMovie ? (
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
					{/* Dark Gradient Overlay */}
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

						<p className="text-lg font-light max-w-xl">
							{selectedMovie.overview ||
								selectedMovie.tagline ||
								"No summary available."}
						</p>

						{/* Get Started Button */}
						<button
							onClick={handleGetStarted}
							className="bg-[#e50914] text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-[#ff0a16] transition duration-200"
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
	);
};

export default MovieDetailModal;
