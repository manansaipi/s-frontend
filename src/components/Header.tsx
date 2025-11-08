import React from "react";
import netflixLogo from "/assets/netflix-logo.png";
import { Button, Image } from "antd";

const Header = () => {
	return (
		<div className="flex justify-between items-center  p-5 ">
			<div>
				<img
					src={netflixLogo}
					alt=""
					className="h-6"
				/>
			</div>
			<div className="flex items-center gap-2 text-white">
				{/* <button className="bg-[#e50914] p-2 rounded-md  px-5">Sign In</button> */}
			</div>
		</div>
	);
};

export default Header;
