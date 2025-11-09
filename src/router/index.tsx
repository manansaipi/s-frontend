// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import SearchPage from "@/pages/SearchPage";
import DetailPage from "@/pages/DetailPage";
import FavoritesPage from "@/pages/FavoritesPage";

const AppRoutes = () => (
	<Routes>
		<Route
			path="/"
			element={<Main />}
		>
			<Route
				path="/search"
				element={<SearchPage />}
			/>
			<Route
				path="/favorites"
				element={<FavoritesPage />}
			/>
			<Route
				path="/movie/:id"
				element={<DetailPage />}
			/>
		</Route>
	</Routes>
);

export default AppRoutes;
