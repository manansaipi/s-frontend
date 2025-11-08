import React, { useState } from "react";
import netflixLogo from "/assets/netflix-logo.png";
import { Button, Image, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const [query, setQuery] = useState("");

	const isHomePage = location.pathname === "/";

	const handleSearch = (searchQuery: string) => {
		if (!searchQuery.trim()) return;

		setIsSearchModalOpen(false);
		setQuery("");

		navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch(query);
		}
	};

	return (
		<div className="flex justify-between items-center p-5 absolute top-0 left-0 right-0 z-40">
			<div
				className="cursor-pointer"
				onClick={() => navigate("/")}
			>
				<img
					src={netflixLogo}
					alt="Netflix Logo"
					className="h-6"
				/>
			</div>

			{/* Conditional Rendering: Show Search Icon only if NOT on the home page */}
			{!isHomePage && (
				<div className="flex items-center gap-2 text-white">
					<button
						className="p-2 rounded-full cursor-pointer bg-transparent hover:bg-gray-800 transition duration-200"
						onClick={() => setIsSearchModalOpen(true)}
					>
						<FaSearch size={20} />
					</button>
				</div>
			)}

			{/* Search Modal Implementation */}
			<Modal
				title={null}
				closable={false}
				footer={null}
				open={isSearchModalOpen}
				onCancel={() => setIsSearchModalOpen(false)}
				styles={{
					content: {
						padding: 0,
						boxShadow: "none",
						border: "none",
					},
					mask: {
						backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark semi-transparent overlay
					},
				}}
				width={"80%"}
				rootClassName="search-modal-container"
			>
				{/* Search Bar Content */}
				<div className="relative p-2 rounded-lg bg-[#333538] border border-white/50 w-full">
					<FaSearch
						className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
						size={24}
					/>
					<input
						type="text"
						placeholder="Search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						autoFocus={true}
						className="bg-transparent text-white text-xl font-medium w-full py-4 pl-12 pr-4 focus:outline-none placeholder-white/70 "
					/>

					<button
						onClick={() => setQuery("")}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
						aria-label="Close search"
					>
						<IoMdClose />
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default Header;
