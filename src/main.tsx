import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "antd/dist/reset.css";
import { ConfigProvider, theme } from "antd";

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				<App />
			</ConfigProvider>
		</BrowserRouter>
	</React.StrictMode>
);
