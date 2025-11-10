import React, { useState } from "react";
import { Modal, Form, Input, Button, Tabs, message, notification } from "antd";
import {
	loginUser,
	registerUser,
	setAuthToken,
} from "@/services/internalService";
import { Lock, User } from "lucide-react";

interface AuthModalProps {
	isVisible: boolean;
	onClose: () => void;
	onLoginSuccess: (username: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
	isVisible,
	onClose,
	onLoginSuccess,
}) => {
	const [activeTab, setActiveTab] = useState("login");
	const [loading, setLoading] = useState(false);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [confirmError, setConfirmError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setUsernameError(null);
		setPasswordError(null);
		setConfirmError(null);
		setLoading(true);

		if (!username) {
			setUsernameError("Please input your Username!");
			setLoading(false);
			return;
		}
		if (!password) {
			setPasswordError("Please input your Password!");
			setLoading(false);
			return;
		}
		if (activeTab === "register" && !confirmPassword) {
			setConfirmError("Please confirm your password!");
			setLoading(false);
			return;
		}
		if (activeTab === "register" && password !== confirmPassword) {
			setConfirmError("The two passwords do not match!");
			setLoading(false);
			return;
		}

		try {
			if (activeTab === "login") {
				const response = await loginUser({ user_name: username, password });
				setAuthToken(response.access_token);
				onLoginSuccess(username);
				message.success("Login successful!");
				onClose();
			} else {
				await registerUser({ user_name: username, password });

				notification.success({
					message: "Registration Successful",
					description: "You are now registered! Please Sign In.",
				});

				setActiveTab("login");
				clearFormState();
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.detail || `Operation failed: ${activeTab}`;
			message.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const clearFormState = () => {
		setUsername("");
		setPassword("");
		setConfirmPassword("");
		setUsernameError(null);
		setPasswordError(null);
		setConfirmError(null);
		setLoading(false);
	};

	const handleTabChange = (key: string) => {
		setActiveTab(key);
		clearFormState();
	};

	const loginForm = (
		<div className="p-4 space-y-4">
			<div>
				<Input
					prefix={<User />}
					placeholder="Username"
					size="large"
					className="bg-gray-800 text-white border-gray-700 hover:border-[#e50914]"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				{usernameError && (
					<p className="text-red-500 text-xs mt-1 ml-1">{usernameError}</p>
				)}
			</div>
			<div>
				<Input
					prefix={<Lock />}
					type="password"
					placeholder="Password"
					size="large"
					className="bg-gray-800 text-white border-gray-700 hover:border-[#e50914]"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{passwordError && (
					<p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>
				)}
			</div>
			<Button
				type="primary"
				onClick={handleSubmit}
				loading={loading}
				className="w-full bg-[#e50914] border-none hover:bg-[#ff0a16] transition duration-200"
				size="large"
			>
				{loading ? "Processing..." : "Log In"}
			</Button>
		</div>
	);

	const registerForm = (
		<div className="p-4 space-y-4">
			<div>
				<Input
					prefix={<User />}
					placeholder="New Username"
					size="large"
					className="bg-gray-800 text-white border-gray-700 hover:border-[#e50914]"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				{usernameError && (
					<p className="text-red-500 text-xs mt-1 ml-1">{usernameError}</p>
				)}
			</div>
			<div>
				<Input.Password
					prefix={<Lock />}
					placeholder="Password"
					size="large"
					className="bg-gray-800 text-white border-gray-700 hover:border-[#e50914]"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{passwordError && (
					<p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>
				)}
			</div>
			<div>
				<Input.Password
					prefix={<Lock />}
					placeholder="Confirm Password"
					size="large"
					className="bg-gray-800 text-white border-gray-700 hover:border-[#e50914]"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				{confirmError && (
					<p className="text-red-500 text-xs mt-1 ml-1">{confirmError}</p>
				)}
			</div>
			<Button
				type="primary"
				onClick={handleSubmit}
				loading={loading}
				className="w-full bg-[#e50914] border-none hover:bg-[#ff0a16] transition duration-200"
				size="large"
			>
				{loading ? "Processing..." : "Register"}
			</Button>
		</div>
	);

	const tabItems = [
		{ key: "login", label: "Sign In", children: loginForm },
		{ key: "register", label: "Sign Up", children: registerForm },
	];

	return (
		<Modal
			title={null}
			centered
			open={isVisible}
			onCancel={onClose}
			footer={null}
			width={400}
			styles={{
				content: {
					backgroundColor: "#141414",
					borderRadius: "8px",
					padding: "0",
					color: "white",
					boxShadow: "0 3px 6px rgba(0,0,0,0.5)",
				},
				mask: {
					backdropFilter: "blur(4px)",
					backgroundColor: "rgba(0, 0, 0, 0.7)",
				},
			}}
			rootClassName="[&_.ant-tabs-nav]:mx-auto [&_.ant-tabs-nav]:w-max [&_.ant-tabs-tab-active]:text-white [&_.ant-tabs-tab]:text-gray-400 [&_.ant-tabs-ink-bar]:bg-[#e50914]"
		>
			<div className="p-8">
				<h2 className="text-3xl font-bold mb-6 text-white text-center">
					{activeTab === "login" ? "Sign In" : "Register"}
				</h2>
				<Tabs
					activeKey={activeTab}
					onChange={handleTabChange}
					items={tabItems}
				/>
			</div>
		</Modal>
	);
};

export default AuthModal;
