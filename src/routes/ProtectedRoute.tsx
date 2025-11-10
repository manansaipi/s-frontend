import { getAuthToken } from "@/services/internalService";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const token = getAuthToken();

	if (!token) {
		return (
			<Navigate
				to="/"
				replace
			/>
		);
	}

	// otherwise render the outlet
	return <Outlet />;
};

export default ProtectedRoute;
