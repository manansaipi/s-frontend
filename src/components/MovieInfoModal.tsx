import React, { useState, useEffect } from "react";
import { Modal, Spin, Tabs, Carousel, Image } from "antd";
import {
	getMovieCredits,
	getMovieReviews,
	getMovieImages,
} from "@/services/tmdbService";
import type {
	MovieDetailDTO,
	GenreDTO,
	MovieCreditsDTO,
	MovieReviewsResponseDTO,
	CastMemberDTO,
	MovieImagesDTO,
} from "@/dto/MovieDetailDTO";
import { FaUserCircle, FaStar } from "react-icons/fa";

const IMAGE_BASE_URL_PROFILE = "https://image.tmdb.org/t/p/w185";
const IMAGE_BASE_URL_LARGE = "https://image.tmdb.org/t/p/w1280";

interface MovieInfoModalProps {
	movieId: number | null;
	movieDetail: MovieDetailDTO | null;
	isVisible: boolean;
	onClose: () => void;
}

const CrewInfo: React.FC<{ crew: MovieCreditsDTO["crew"] }> = ({ crew }) => {
	// Helper function to find and list crew names by job
	const getJobNames = (job: string, count: number = 2) =>
		crew
			.filter((c) => c.job === job)
			.map((c) => c.name)
			.slice(0, count)
			.join(", ") || "N/A";

	return (
		<div className="space-y-3">
			<h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">
				Key Crew
			</h3>
			<p>
				<span className="font-semibold text-gray-400">Director:</span>{" "}
				<span className="text-white">{getJobNames("Director", 1)}</span>
			</p>
			<p>
				<span className="font-semibold text-gray-400">Screenplay:</span>{" "}
				<span className="text-white">{getJobNames("Screenplay", 2)}</span>
			</p>
			<p>
				<span className="font-semibold text-gray-400">Editor:</span>{" "}
				<span className="text-white">{getJobNames("Editor", 2)}</span>
			</p>
			<p>
				<span className="font-semibold text-gray-400">Music Composer:</span>{" "}
				<span className="text-white">
					{getJobNames("Original Music Composer", 1)}
				</span>
			</p>
			<p>
				<span className="font-semibold text-gray-400">Cinematography:</span>{" "}
				<span className="text-white">
					{getJobNames("Director of Photography", 1)}
				</span>
			</p>
			<p>
				<span className="font-semibold text-gray-400">Producer:</span>{" "}
				<span className="text-white">{getJobNames("Producer", 3)}</span>
			</p>
		</div>
	);
};

const CastSection: React.FC<{ cast: CastMemberDTO[] }> = ({ cast }) => {
	return (
		<div className="space-y-4">
			<h3 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">
				Top Cast
			</h3>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				<Image.PreviewGroup>
					{cast.map((member) => (
						<div
							key={member.id}
							className="flex flex-col items-center text-center"
						>
							<div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center mb-2 shadow-lg">
								{member.profile_path ? (
									<Image
										src={`${IMAGE_BASE_URL_PROFILE}${member.profile_path}`}
										alt={member.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<FaUserCircle
										size={40}
										className="text-gray-500"
									/>
								)}
							</div>
							<p className="text-sm font-semibold leading-tight text-white">
								{member.name}
							</p>
							<p className="text-xs text-gray-400 truncate w-full">
								{member.character}
							</p>
						</div>
					))}
				</Image.PreviewGroup>
			</div>
		</div>
	);
};

const ReviewSection: React.FC<{ reviews: MovieReviewsResponseDTO | null }> = ({
	reviews,
}) => {
	if (!reviews || reviews.results.length === 0) {
		return (
			<p className="text-gray-400">No user reviews found for this movie.</p>
		);
	}

	return (
		<div className="space-y-6">
			<h3 className="text-xl font-bold border-b border-gray-700 pb-2">
				Top Reviews ({reviews.total_results})
			</h3>
			{reviews.results.slice(0, 3).map((review) => (
				<div
					key={review.id}
					className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-xl"
				>
					<div className="flex items-start space-x-3 mb-3">
						<FaUserCircle
							size={32}
							className="text-gray-500 shrink-0 mt-1"
						/>
						<div>
							<p className="font-bold text-white leading-tight">
								{review.author_details.username || review.author}
							</p>
							<p className="text-xs text-gray-400">
								Reviewed on: {new Date(review.created_at).toLocaleDateString()}
							</p>
							{review.author_details.rating && (
								<div className="flex items-center text-sm mt-1">
									<FaStar className="text-yellow-400 mr-1" />
									<span className="font-semibold text-white">
										{review.author_details.rating}
									</span>
									<span className="text-gray-400 ml-1">/ 10</span>
								</div>
							)}
						</div>
					</div>
					<p className="text-sm text-gray-300 max-h-24 overflow-hidden relative">
						{review.content}
						<div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-gray-900 to-transparent pointer-events-none"></div>
					</p>
					<a
						href={review.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#E50914] text-sm mt-2 block hover:underline"
					>
						Read Full Review
					</a>
				</div>
			))}
		</div>
	);
};

const GallerySection: React.FC<{
	images: MovieImagesDTO | null;
	movieDetail: MovieDetailDTO;
}> = ({ images, movieDetail }) => {
	// Filter backdrops to show only English or no language defined, and take top 10
	const backdrops =
		images?.backdrops
			.filter((img) => img.iso_639_1 === null || img.iso_639_1 === "en")
			.slice(0, 10) || [];

	if (backdrops.length === 0) {
		return (
			<div>
				<img
					src={`https://image.tmdb.org/t/p/original${
						movieDetail.backdrop_path || movieDetail.poster_path
					}`}
					alt=""
					className="w-full h-[60vh] object-cover"
				/>
			</div>
		);
	}

	return (
		<div className="">
			<Carousel
				autoplay
				className="w-full rounded-lg overflow-hidden"
				draggable
				arrows
				adaptiveHeight
			>
				{backdrops.map((image, index) => (
					<div
						key={index}
						className=" w-full rounded-lg overflow-hidden"
					>
						<img
							src={`${IMAGE_BASE_URL_LARGE}${image.file_path}`}
							alt={`Gallery image ${index + 1}`}
							className="w-full h-[60vh] object-cover"
							onError={(e) => {
								(e.target as HTMLImageElement).style.display = "none";
							}}
						/>
					</div>
				))}
			</Carousel>
		</div>
	);
};

// MAIN MODDAL COMPONENNT
const MovieInfoModal: React.FC<MovieInfoModalProps> = ({
	movieId,
	movieDetail,
	isVisible,
	onClose,
}) => {
	const [credits, setCredits] = useState<MovieCreditsDTO | null>(null);
	const [reviews, setReviews] = useState<MovieReviewsResponseDTO | null>(null);
	const [images, setImages] = useState<MovieImagesDTO | null>(null);
	const [loadingExtra, setLoadingExtra] = useState(false);

	useEffect(() => {
		if (!isVisible || movieId === null) {
			setCredits(null);
			setReviews(null);
			setImages(null);
			return;
		}

		const fetchExtraData = async () => {
			setLoadingExtra(true);
			try {
				// Fetch all data in parallel
				const [creditsData, reviewsData, imagesData] = await Promise.all([
					getMovieCredits(movieId),
					getMovieReviews(movieId),
					getMovieImages(movieId),
				]);

				setCredits(creditsData);
				setReviews(reviewsData);
				setImages(imagesData);
			} catch (err) {
				console.error("Failed to fetch extra movie data:", err);
			} finally {
				setLoadingExtra(false);
			}
		};
		fetchExtraData();
	}, [isVisible, movieId]);

	if (!movieDetail) return null;

	const InfoContent = (
		<div className="space-y-5 text-white p-2">
			<p className="text-gray-300 text-lg italic">{movieDetail.tagline}</p>
			<p className="text-lg">{movieDetail.overview}</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 border-t border-b border-gray-700 py-4">
				<div>
					<p className="font-semibold text-gray-400">Status</p>
					<p className="text-white">{movieDetail.status}</p>
				</div>
				<div>
					<p className="font-semibold text-gray-400">Original Language</p>
					<p className="text-white">
						{movieDetail.original_language.toUpperCase()}
					</p>
				</div>
				<div>
					<p className="font-semibold text-gray-400">Runtime</p>
					<p className="text-white">{movieDetail.runtime} min</p>
				</div>
				<div className="md:col-span-3">
					<p className="font-semibold text-gray-400">Genres</p>
					<p className="text-white">
						{movieDetail.genres.map((g: GenreDTO) => g.name).join(" / ")}
					</p>
				</div>
			</div>

			{credits && <CrewInfo crew={credits.crew} />}
		</div>
	);

	const tabsItems = [
		{
			key: "info",
			label: "Details & Crew",
			children: InfoContent,
		},
		{
			key: "cast",
			label: `Cast (${credits ? credits.cast.length : 0})`,
			children: loadingExtra ? (
				<Spin
					tip="Loading cast..."
					className="p-10"
				/>
			) : (
				<CastSection cast={credits?.cast || []} />
			),
		},
		{
			key: "reviews",
			label: `Reviews (${reviews ? reviews.total_results : 0})`,
			children: loadingExtra ? (
				<Spin
					tip="Loading reviews..."
					className="p-10"
				/>
			) : (
				<ReviewSection reviews={reviews} />
			),
		},
	];

	return (
		<Modal
			centered
			closable={true}
			closeIcon={
				<span className="text-white text-3xl opacity-80 hover:opacity-100">
					&times;
				</span>
			}
			footer={null}
			open={isVisible}
			onCancel={onClose}
			width={"70%"}
			styles={{
				content: {
					padding: 0,
					overflow: "hidden",
					borderRadius: "8px",
				},
				mask: {
					backdropFilter: "blur(5px)",
				},
				body: {
					maxHeight: "calc(90vh)",
					overflowY: "scroll",
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				},
			}}
		>
			<GallerySection
				images={images}
				movieDetail={movieDetail}
			/>
			<div className="max-h-[80vh] overflow-y-auto p-6 pt-0">
				<Tabs
					defaultActiveKey="info"
					items={tabsItems}
					className="custom-tabs"
				/>
			</div>
		</Modal>
	);
};

export default MovieInfoModal;
