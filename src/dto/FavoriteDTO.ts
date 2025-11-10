export interface FavoriteCreate {
	movie_id: number;
	title: string;
	poster_path: string | null;
}

export interface FavoriteOut {
	id: number;
	user_id: number;
	movie_id: number;
	title: string;
	poster_path: string | null;
}
