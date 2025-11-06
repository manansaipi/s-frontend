import React, { useState } from "react";
import { Input, Pagination } from "antd";
import { searchMovies } from "../services/omdbService";
import { MovieCard } from "../components/MovieCard";

export const HomePage: React.FC = () => {
	const [q, setQ] = useState("");
	const [results, setResults] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	async function doSearch(p = 1) {
		if (!q) return;
		setLoading(true);
		const data = await searchMovies(q, p);
		setLoading(false);
		if (data?.Search) {
			setResults(data.Search);
			setTotal(
				Number(
					data.totalResults || data.totalResults === 0
						? data.totalResults
						: data.Search.length
				)
			);
		} else {
			setResults([]);
			setTotal(0);
		}
	}

	return (
		<div>
			<div className="flex gap-4 mb-6">
				<Input.Search
					placeholder="Search movies (e.g. Inception)"
					enterButton
					value={q}
					onChange={(e) => setQ(e.target.value)}
					onSearch={() => {
						setPage(1);
						doSearch(1);
					}}
					loading={loading}
				/>
			</div>

			<div className="movie-grid">
				{results.map((m) => (
					<MovieCard
						key={m.imdbID}
						movie={m}
					/>
				))}
			</div>

			{total > 10 && (
				<div className="mt-6 flex justify-center">
					<Pagination
						current={page}
						total={total}
						pageSize={10}
						onChange={(p) => {
							setPage(p);
							doSearch(p);
						}}
					/>
				</div>
			)}
		</div>
	);
};
