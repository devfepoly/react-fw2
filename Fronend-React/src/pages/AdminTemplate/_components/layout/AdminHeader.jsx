import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@services/auth.service';

const AdminHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md fixed w-full top-0 z-50">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Về trang chủ
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {user?.ho_ten || 'Admin'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
