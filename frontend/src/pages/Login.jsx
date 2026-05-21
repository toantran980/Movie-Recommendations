import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/useAuthContext';
import '../css/Auth.css';

function Login() {
    const { login, user, loading } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, from, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(null);

        if (!email || !password) {
            setFormError('Both email and password are required');
            return;
        }

        const result = await login({ email, password });
        if (!result.success) {
            setFormError(result.error || 'Login failed');
            return;
        }

        navigate(from, { replace: true });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Welcome back</h2>
                <p>Log in to sync your favorites and watchlist across devices.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                    {formError && <div className="auth-error">{formError}</div>}
                    <button type="submit" className="auth-button" disabled={loading}>Login</button>
                </form>
                <p className="auth-footer">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
