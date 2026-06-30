import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    console.log('PROTECTED: loading=', loading, "isAuthenticated=", isAuthenticated)

    // Wait for the /me check to finish before deciding - otherwise a refresh
    // would bounce a logged-in user to /login during the brief loading window.
    if (loading) return <p className="p-8 text-center">Loading...</p>;

    if (!isAuthenticated) {
        // Remember where they were headed, so login can send them back.
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />
}