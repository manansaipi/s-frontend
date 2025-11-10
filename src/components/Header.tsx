import React, { useState, useEffect } from "react";
import netflixLogo from "/assets/netflix-logo.png";
import { Dropdown, type MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import SearchModal from "./SearchModal";
import AuthModal from "./AuthModal"; 
import { getAuthToken, removeAuthToken } from "@/services/internalService";

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		const token = getAuthToken();
		if (token) {
			try {
				// Decode the JWT (base64 string) to extract the username (sub claim)
				const payload = JSON.parse(atob(token.split(".")[1]));
				setUsername(payload.sub || "User");
			} catch (e) {
				setUsername(null);
				removeAuthToken();
			}
		}
	}, []);

	const isHomePage = location.pathname === "/";

	const handleSearch = (searchQuery: string) => {
		if (!searchQuery.trim()) return;

		setIsSearchModalOpen(false);
		setQuery("");

		navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
	};

	const handleLogout = () => {
		removeAuthToken();
		setUsername(null);
		navigate("/");
	};

	const menuItems: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<span className="font-semibold text-gray-500">
					Logged in as: {username}
				</span>
			),
			disabled: true,
		},
		{
			type: "divider",
		},
		{
			key: "2",
			label: "Logout",
			onClick: handleLogout,
		},
	];

	return (
		<>
			<div className="flex justify-between items-center p-5 absolute top-0 left-0 right-0 z-40">
				<div
					className="cursor-pointer"
					onClick={() => navigate("/")}
				>
					<img
						src={netflixLogo}
						alt="Netflix Logo"
						className="h-6"
						onError={(e) => {
							(e.target as HTMLImageElement).src =
								"https://placehold.co/100x24/E50914/ffffff?text=NETFLIX";
						}}
					/>
				</div>

				<div className="flex items-center gap-4 text-white">
					{!isHomePage && (
						<button
							className="p-2 rounded-full cursor-pointer bg-transparent hover:bg-gray-800 transition duration-200"
							onClick={() => setIsSearchModalOpen(true)}
						>
							<FaSearch size={20} />
						</button>
					)}

					{/* Auth Button/User Profile */}
					{username ? (
						<Dropdown
							menu={{ items: menuItems }}
							placement="bottomRight"
							arrow
						>
							<button className="flex items-center gap-2 p-2 rounded-full bg-[#e50914] hover:bg-[#ff0a16] transition duration-200">
								<span className="font-semibold text-sm hidden md:inline">
									{username}
								</span>
								<FaUserCircle size={20} />
							</button>
						</Dropdown>
					) : (
						<button
							className="bg-[#e50914] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#ff0a16] transition duration-200 cursor-pointer"
							onClick={() => setIsAuthModalOpen(true)}
						>
							Sign In
						</button>
					)}
				</div>
			</div>

			{/* Search Modal */}
			<SearchModal
				open={isSearchModalOpen}
				query={query}
				onClose={() => setIsSearchModalOpen(false)}
				onChange={setQuery}
				onSearch={handleSearch}
			/>

			{/* Auth Modal */}
			<AuthModal
				isVisible={isAuthModalOpen}
				onClose={() => setIsAuthModalOpen(false)}
				onLoginSuccess={(name) => {
					setUsername(name);
					setIsAuthModalOpen(false);
				}}
			/>
		</>
	);
};

export default Header;
