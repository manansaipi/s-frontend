import { ConfigProvider } from "antd";
import AppRoutes from "./routes";

export default function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: "#e50914",
				},
			}}
		>
			<AppRoutes />
		</ConfigProvider>
	);
}
