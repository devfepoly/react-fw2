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
    const isAuth = authService.isAuthenticated();
    const isAdminUser = authService.isAdmin();

    console.log('AdminGuard check:', { isAuth, isAdminUser });

    if (!isAuth) {
        console.log('Not authenticated, redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    if (!isAdminUser) {
        console.log('Not admin, redirecting to /');
        return <Navigate to="/" replace />;
    }

    console.log('Admin access granted');
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
