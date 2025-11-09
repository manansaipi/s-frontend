import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import HomePage from "./HomePage";

const Main = () => {
	const location = useLocation();
	const path = location.pathname;

	// show background only on home andd search pages
	const showBackground =
		path === "/" || path.startsWith("/search") || path.startsWith("/favorites");

	return (
		<div
			className={`relative min-h-screen ${
				showBackground
					? "bg-cover bg-center bg-no-repeat bg-[url('/assets/bg_front.jpg')]"
					: "bg-black"
			}`}
		>
			{showBackground && (
				<div className="absolute inset-0 bg-black opacity-70 z-0"></div>
			)}

			<div className="relative z-10">
				<Header />
				{path === "/" ? <HomePage /> : <Outlet />}
			</div>
		</div>
	);
};

export default Main;
