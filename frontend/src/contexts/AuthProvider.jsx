import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMe = async () => {
        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Unable to fetch current user:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    const login = async ({ email, password }) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Login failed');
                return { success: false, error: data.error };
            }

            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Try again later.');
            return { success: false, error: 'Login failed' };
        }
    };

    const register = async ({ email, password }) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return { success: false, error: data.error };
            }

            setUser(data.user);
            return { success: true };
        } catch (err) {
            console.error('Register error:', err);
            setError('Registration failed. Try again later.');
            return { success: false, error: 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser: fetchMe,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
