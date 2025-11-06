import React, { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../services/backendService";
import { MovieCard } from "../components/MovieCard";

export const FavoritesPage: React.FC = () => {
	const [favorites, setFavorites] = useState<any[]>([]);

	useEffect(() => {
		getFavorites("demo-user").then((r) => setFavorites(r || []));
	}, []);

	async function onRemove(id: string) {
		await removeFavorite(id);
		setFavorites((s) => s.filter((f) => f.id !== id));
	}

	return (
		<div>
			<h2 className="text-xl mb-4">My Favorites</h2>
			<div className="movie-grid">
				{favorites.map((f) => (
					<div key={f.id}>
						<MovieCard
							movie={f.movie}
							onFavorite={() => onRemove(f.id)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
