// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";

const AppRoutes = () => (
	<Routes>
		<Route
			path="/"
			element={<Main />}
		>
			{/* <Route
				path="/detail"
				element={<HomePage />}
			/> */}
		</Route>
	</Routes>
);

export default AppRoutes;
