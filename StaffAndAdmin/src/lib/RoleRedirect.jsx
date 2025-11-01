import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RoleRedirect(){
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;
    try {
        const decoded = jwtDecode(token);
        if (decoded.role_id === 1) return <Navigate to="/admin" replace />;
        if (decoded.role_id === 2) return <Navigate to="/staff" replace />;
        return <Navigate to="/unauthorized" replace />;
    } catch {
        return <Navigate to="/login" replace />;
    }
}