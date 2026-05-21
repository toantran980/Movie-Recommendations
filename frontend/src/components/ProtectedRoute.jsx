import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/useAuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuthContext();
    const location = useLocation();

    if (loading) {
        return <div className="page-loader">Loading account...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
