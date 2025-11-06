import api from "./api";

export async function addFavorite(userId: string, movie: any) {
	const res = await api.post("/favorites", { user_id: userId, movie });
	return res.data;
}

export async function getFavorites(userId: string) {
	const res = await api.get(`/favorites/${userId}`);
	return res.data;
}

export async function removeFavorite(favId: string) {
	const res = await api.delete(`/favorites/${favId}`);
	return res.data;
}
