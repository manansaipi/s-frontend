import AppRoutes from "./router";

// const { Header, Content } = Layout;

export default function App() {
	return (
		<AppRoutes />
		// <Layout className="min-h-screen">
		// 	<Header className="flex items-center justify-between">
		// 		<div className="text-white text-xl font-semibold">Movie Explorer</div>
		// 		<Menu
		// 			theme="dark"
		// 			mode="horizontal"
		// 			selectable={false}
		// 		>
		// 			<Menu.Item key="home">
		// 				<Link to="/">Home</Link>
		// 			</Menu.Item>
		// 			<Menu.Item key="favorites">
		// 				<Link to="/favorites">Favorites</Link>
		// 			</Menu.Item>
		// 		</Menu>
		// 	</Header>
		// 	<Content className="p-6 bg-gray-50">
		// 		<Routes>
		// 			<Route
		// 				path="/"
		// 				element={<HomePage />}
		// 			/>
		// 			<Route
		// 				path="/movie/:id"
		// 				element={<DetailPage />}
		// 			/>
		// 			<Route
		// 				path="/favorites"
		// 				element={<FavoritesPage />}
		// 			/>
		// 		</Routes>
		// 	</Content>
		// </Layout>
	);
}
