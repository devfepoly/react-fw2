import { Navigate } from 'react-router-dom';
import { authService } from '@services/auth.service';

/**
 * @deprecated Use AuthGuard or RoleGuard from components/auth instead
 * This component is kept for backward compatibility
 * 
 * Recommended:
 * - Use AuthGuard for routes requiring authentication
 * - Use RoleGuard for routes requiring specific roles
 * - Use GuestGuard for guest-only routes (login, register)
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole === 'admin' && !authService.isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
