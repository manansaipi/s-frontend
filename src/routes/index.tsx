// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import SearchPage from "@/pages/SearchPage";
import DetailPage from "@/pages/DetailPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
	<Routes>
		<Route path="/" element={<Main />}>
			<Route path="/search" element={<SearchPage />} />
			<Route path="/movie/:id" element={<DetailPage />} />

			<Route element={<ProtectedRoute />}>
				<Route path="/favorites" element={<FavoritesPage />} />
			</Route>
		</Route>
	</Routes>
);

export default AppRoutes;
