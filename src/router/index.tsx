// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import SearchPage from "@/pages/SearchPage";
import DetailPage from "@/pages/DetailPage";

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
				path="/movie/:id"
				element={<DetailPage />}
			/>
		</Route>
	</Routes>
);

export default AppRoutes;
