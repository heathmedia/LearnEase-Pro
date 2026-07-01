import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router";

export default function SignUp() {
    const { register, isAuthenticated } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError]  = useState('');
    const [submitting, setSubmitting] = useState(false);

    const rawFrom = location.state?.from?.pathname || '/';
    const from = rawFrom === '/signup' ? '/' : rawFrom // Never bounce back to login

    // Already logged in? Don't show the sign up form and send to intended location.
    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        
        setSubmitting(true);
        try {
            await register(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex items-center mt-20 ml-10">
                <div className="grid border-1 p-10 pb-5 w-100 rounded-lg flex flex-wrap bg-white">
                    <h1 className="text-center w-full text-2xl font-bold mb-5">Create your LearnEase Pro account</h1>
                    {error && (
                        <p className="text-center mb-2 text-red-500" id="message">{error}</p>
                    )}
                    <div className="mb-3 grid grid-cols-1">
                        <label htmlFor="email" className="mb-1">Email</label>
                        <input id="email" type="email" required placeholder="Enter email address"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="self-justify-end border-1 px-2 py-1 rounded" />
                    </div>
                    <div className="mb-3 grid grid-cols-1">
                        <label htmlFor="password" className="mb-2">Password</label>
                        <input id="password" type="password" required placeholder="Enter password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="self-justify-end border-1 px-2 py-1 rounded" />
                    </div>
                    <div className="mb-3 grid grid-cols-1">
                        <label htmlFor="confirmPassword" className="mb-2">Confirm password</label>
                        <input id="password" type="password" required placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="self-justify-end border-1 px-2 py-1 rounded" />
                    </div>
                    <button type="submit" disabled={submitting}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                            {submitting ? 'Creating account...' : 'Sign up'}
                    </button>
                    <p className="text-center mt-4">Already have an account? <Link to="login" className="underline text-primary">Log in</Link></p>
                </div>
            </form>
        </div>
    );
}