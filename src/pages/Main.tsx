import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import HomePage from "./HomePage";

const Main = () => {
	const location = useLocation();
	const isHome = location.pathname === "/";

	return (
		<div
			className={`relative min-h-screen
				${"bg-cover bg-center bg-no-repeat bg-[url('/assets/bg_front.jpg')] "}`}
		>
			<div className="absolute inset-0 bg-black opacity-70 z-0"></div>

			<div className="relative z-10">
				<Header />
				{isHome ? <HomePage /> : <Outlet />}
			</div>
		</div>
	);
};

export default Main;
