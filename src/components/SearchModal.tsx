import React from "react";
import { Modal } from "antd";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface SearchModalProps {
	open: boolean;
	query: string;
	onClose: () => void;
	onChange: (value: string) => void;
	onSearch: (value: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
	open,
	query,
	onClose,
	onChange,
	onSearch,
}) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			onSearch(query);
		}
	};

	return (
		<Modal
			title={null}
			closable={false}
			footer={null}
			open={open}
			onCancel={onClose}
			styles={{
				content: {
					padding: 0,
					boxShadow: "none",
					border: "none",
				},
				mask: {
					backgroundColor: "rgba(0, 0, 0, 0.7)",
				},
			}}
			width={"80%"}
			rootClassName="search-modal-container"
		>
			<div className="relative p-2 rounded-lg bg-[#333538] border border-white/50 w-full">
				<FaSearch
					className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
					size={24}
				/>
				<input
					type="text"
					placeholder="Search"
					value={query}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={handleKeyDown}
					autoFocus={true}
					className="bg-transparent text-white text-xl font-medium w-full py-4 pl-12 pr-4 focus:outline-none placeholder-white/70"
				/>
				<button
					onClick={() => onChange("")}
					className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
					aria-label="Close search"
				>
					<IoMdClose />
				</button>
			</div>
		</Modal>
	);
};

export default SearchModal;
