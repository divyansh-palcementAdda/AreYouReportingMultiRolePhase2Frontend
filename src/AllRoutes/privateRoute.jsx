import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute() {
    const location = useLocation();
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}