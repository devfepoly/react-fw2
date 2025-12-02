import { Navigate } from 'react-router-dom';
import { authService } from '@services/auth.service';

// Protect routes that require authentication
export const AuthGuard = ({ children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Protect admin routes
export const AdminGuard = ({ children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!authService.isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Guest only routes (login, register)
export const GuestGuard = ({ children }) => {
    if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        return <Navigate to={user?.vai_tro === 1 ? '/admin' : '/'} replace />;
    }
    return children;
};
