// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import SearchPage from "@/pages/SearchPage";

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
		</Route>
	</Routes>
);

export default AppRoutes;
