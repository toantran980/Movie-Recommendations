import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/useAuthContext';
import '../css/Auth.css';

function Register() {
    const { register, user, loading } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(null);

        if (!email || !password || !confirmPassword) {
            setFormError('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        const result = await register({ email, password });
        if (!result.success) {
            setFormError(result.error || 'Registration failed');
            return;
        }

        navigate('/', { replace: true });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create an account</h2>
                <p>Start saving favorites and watchlists that stay with you.</p>
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
                        placeholder="Create a password"
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                    />
                    {formError && <div className="auth-error">{formError}</div>}
                    <button type="submit" className="auth-button" disabled={loading}>Register</button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
