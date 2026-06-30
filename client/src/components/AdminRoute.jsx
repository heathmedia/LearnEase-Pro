import { Navigate, Outlet } from "react-router";
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
    const { user, loading } = useAuth();

    if (loading) return <p className="p-8 text-center">Loading...</p>;

    // Not an admin -> send to the dashboard rather than login (they ARE logged in)
    if (!user || user.type !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}