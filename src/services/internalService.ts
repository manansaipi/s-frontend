import { internalApi } from "./api";

export async function addFavorite(userId: string, movie: any) {
	const res = await internalApi.post("/favorites", { user_id: userId, movie });
	return res.data;
}

export async function getFavorites(userId: string = "id123") {
	const res = await internalApi.get(`/favorites/${userId}`);
	return res.data;
}

export async function removeFavorite(favId: string) {
	const res = await internalApi.delete(`/favorites/${favId}`);
	return res.data;
}
