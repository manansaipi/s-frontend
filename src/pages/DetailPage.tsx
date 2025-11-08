import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../services/external/omdbService";
import { Button } from "antd";
import { addFavorite } from "../services/backendService";

export const DetailPage: React.FC = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		getMovieById(id).then((d) => {
			setMovie(d);
			setLoading(false);
		});
	}, [id]);

	async function save() {
		// temporary user id for demo
		await addFavorite("demo-user", movie);
		alert("Saved to favorites on backend");
	}

	if (!movie) return <div>Loading...</div>;

	return (
		<div className="max-w-3xl mx-auto">
			<div className="flex gap-6">
				<img
					src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
					alt={movie.Title}
					className="w-48"
				/>
				<div>
					<h1 className="text-2xl font-bold">
						{movie.Title} ({movie.Year})
					</h1>
					<p className="mt-2">{movie.Plot}</p>
					<p className="mt-2 text-sm">Director: {movie.Director}</p>
					<p className="mt-1 text-sm">Actors: {movie.Actors}</p>
					<div className="mt-4">
						<Button onClick={save}>Save to favorites</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
