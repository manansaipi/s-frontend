import { useState, useEffect } from "react";
import { Spin, Empty } from "antd"; 
import type { FavoriteOut } from "@/dto/FavoriteDTO";
import MovieDetailModal from "@/components/MovieDetailModal";
import { getFavorites } from "@/services/internalService"; 
import { useNavigate } from "react-router-dom"; 

const FavoritesPage = () => {
	const [favorites, setFavorites] = useState<FavoriteOut[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
	const navigate = useNavigate(); 

	const openMovieModal = (movieId: number) => setSelectedMovieId(movieId);
	const closeMovieModal = () => setSelectedMovieId(null);

	const fetchFavorites = async () => {
		setLoading(true);
		try {
			const data = await getFavorites();
			setFavorites(data);
		} catch (err) {
			console.error("Error fetching favorites:", err);
			setFavorites([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {

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

		fetchFavorites();
	}, [navigate]);

	const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

	return (
		<div className="min-h-screen p-6 pt-20 text-white">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">My Favorite Movies</h1>
			</div>

			<hr className="mb-8 border-gray-800" />

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Spin
						size="large"
						tip="Loading favorites..."
					/>
				</div>
			) : favorites.length === 0 ? (
				<div className="flex justify-center items-center h-64">
					<Empty
						description={
							<span className="text-gray-500">
								You haven’t added any favorite movies yet.
							</span>
						}
					/>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{favorites.map((fav) => (
						<div
							key={fav.id}
							onClick={() => openMovieModal(fav.movie_id)}
							className="relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
						>
							<img
								src={
									fav.poster_path
										? `${IMAGE_BASE_URL}${fav.poster_path}`
										: "/assets/no-image.jpg"
								}
								alt={fav.title}
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
				favorites={favorites}
				onFavoriteChange={fetchFavorites}
			/>
		</div>
	);
};

export default FavoritesPage;
