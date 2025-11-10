
export interface UserAuthData {
	user_name: string;
	password: string;
}

export interface AuthTokenResponse {
	access_token: string;
	token_type: string;
}
