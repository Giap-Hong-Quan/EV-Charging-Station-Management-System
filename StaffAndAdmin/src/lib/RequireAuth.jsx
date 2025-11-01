import React from 'react'

import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function RequireAuth({children, allowedRoles }){
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;
    try {
        const decoded = jwtDecode(token);
        const role = decoded.role_id;
        if (!allowedRoles.includes(role)) {
            return <Navigate to="/unauthorized" replace />;
        }
        return children;
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" replace />;
    }
}