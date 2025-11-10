export interface GenreDTO {
	id: number;
	name: string;
}

export interface MovieDetailDTO {
	adult: boolean;
	backdrop_path: string | null;
	belongs_to_collection: any | null;
	budget: number;
	genres: GenreDTO[];
	homepage: string | null;
	id: number;
	imdb_id: string | null;
	original_language: string;
	original_title: string;
	overview: string | null;
	popularity: number;
	poster_path: string | null;
	production_companies: Array<{
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}>;
	production_countries: Array<{
		iso_3166_1: string;
		name: string;
	}>;
	release_date: string;
	revenue: number;
	runtime: number | null;
	spoken_languages: Array<{
		english_name: string;
		iso_639_1: string;
		name: string;
	}>;
	status: string;
	tagline: string | null;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}
export interface MovieVideosDTO {
	id: number;
	results: Array<{
		iso_639_1: string;
		iso_3166_1: string;
		name: string;
		key: string;
		site: string;
		size: number;
		type: string;
		official: boolean;
		published_at: string;
		id: string;
	}>;
}

// src/dto/MovieCreditsDTO.ts
export interface CastMemberDTO {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
}

export interface CrewMemberDTO {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
}

export interface MovieCreditsDTO {
	id: number;
	cast: CastMemberDTO[];
	crew: CrewMemberDTO[];
}

export interface ReviewAuthorDetailsDTO {
	name: string;
	username: string;
	avatar_path: string | null;
	rating: number | null;
}

export interface MovieReviewDTO {
	author: string;
	author_details: ReviewAuthorDetailsDTO;
	content: string;
	created_at: string;
	id: string;
	updated_at: string;
	url: string;
}

export interface MovieReviewsResponseDTO {
	id: number;
	page: number;
	results: MovieReviewDTO[];
	total_pages: number;
	total_results: number;
}

// --- DTO: Images ---
export interface ImageFileDTO {
	aspect_ratio: number;
	height: number;
	iso_639_1: string | null;
	file_path: string;
	vote_average: number;
	vote_count: number;
	width: number;
}

export interface MovieImagesDTO {
	id: number;
	backdrops: ImageFileDTO[];
	logos: ImageFileDTO[];
	posters: ImageFileDTO[];
}
