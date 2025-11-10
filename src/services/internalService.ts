import type { AuthTokenResponse, UserAuthData } from "@/dto/UserDTO";
import { internalApi } from "./api";
import type { FavoriteCreate, FavoriteOut } from "@/dto/FavoriteDTO";

export async function registerUser(user: UserAuthData): Promise<any> {
	const res = await internalApi.post("/users/register", user);
	return res.data;
}

export async function loginUser(
	user: UserAuthData
): Promise<AuthTokenResponse> {
	const res = await internalApi.post("/users/token", user);
	return res.data;
}

export async function addFavorite(
	favoriteData: FavoriteCreate
): Promise<FavoriteOut> {
	const res = await internalApi.post("/favorites/add-favorite", favoriteData);
	return res.data;
}

export async function getFavorites(): Promise<FavoriteOut[]> {
	const res = await internalApi.get("/favorites");
	return res.data;
}
export async function removeFavorite(favId: number): Promise<any> {
	const res = await internalApi.delete(`/favorites/${favId}`);
	return res.data;
}

const TOKEN_KEY = "token";

export const setAuthToken = (token: string) => {
	localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
	return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
	localStorage.removeItem(TOKEN_KEY);
};
