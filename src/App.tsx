import { ConfigProvider } from "antd";
import AppRoutes from "./routes";

import { FakeCursorDemo } from "./components/FakeCursorDemo";

export default function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: "#e50914",
				},
			}}
		>
			<FakeCursorDemo />
			<AppRoutes />
		</ConfigProvider>
	);
}
