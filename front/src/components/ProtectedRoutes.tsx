import { Navigate, Outlet, useLocation } from "react-router-dom"
import { tokenReader } from "../tools/TokenReader";


const ProtectedRoutes = () => {
    return tokenReader.isLogged() ? <Outlet /> : <Navigate to="/login" replace state={{ from: useLocation()}} />;
}

export default ProtectedRoutes;