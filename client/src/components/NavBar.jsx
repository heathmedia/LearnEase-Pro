import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
// import logo from "../assets/learnease-pro-logo.png";

export default function NavBar() {

    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // clears token + user from context and localStorage
        navigate('/login', { replace: true });
    }

    return (
        <header className="flex items-center border-b-1 h-18 h-center p-4 justify-between bg-primary-dark">
            <Link to="/" className="text-white">
                LearnEase Pro
            </Link>
            <nav className="text-white">
                {isAuthenticated ? (
                    <>
                        <Link to="/">Dashboard</Link>

                        {/* Admin-only links */}
                        {user?.type === 'admin' && (
                            <Link to="/admin">Admin</Link>
                        )}

                        <button onClick={handleLogout}>Log out</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
}