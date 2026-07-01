import { createContext, useContext, useState, useEffect } from "react";
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On first load, if a token exists, validate it by fetching the current user
    useEffect(() => {
        const init = async () => {
            if (!localStorage.getItem('token')) {
                setLoading(false);
                return;
            }
            try {
                const data = await api('/api/auth/me');
                setUser(data.user);
            } catch {
                // Toekn is invalid, expired, or version-bumped - discard it
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const login = async (email, password) => {
        const data = await api('api/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (email, password) => {
        const data = await api('api/auth/register', {
            method: 'POST',
            body: { email, password },
        });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = ()  => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}