import { Navigate, Outlet, useLocation } from "react-router-dom"
import { tokenReader } from "../tools/TokenReader";
import React, { useEffect } from "react";

const ProtectedRoutes = () => {
    return tokenReader.isLogged() ? <Outlet /> : <Navigate to="/login" replace state={{ from: useLocation()}} />;
}

export default ProtectedRoutes;