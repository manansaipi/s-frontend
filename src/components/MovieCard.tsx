import React from "react";
import { Card, Button } from "antd";
import { Link } from "react-router-dom";

export const MovieCard: React.FC<{ movie: any; onFavorite?: () => void }> = ({
	movie,
	onFavorite,
}) => {
	return (
		<Card
			hoverable
			cover={
				<img
					alt={movie.Title}
					src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
				/>
			}
		>
			<Card.Meta
				title={movie.Title}
				description={movie.Year}
			/>
			<div className="mt-3 flex gap-2">
				<Link to={`/movie/${movie.imdbID}`}>
					<Button type="primary">Details</Button>
				</Link>
				<Button onClick={onFavorite}>Save</Button>
			</div>
		</Card>
	);
};
