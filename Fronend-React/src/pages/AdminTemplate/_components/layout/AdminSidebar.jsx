import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isSidebarOpen }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/products', icon: '📦', label: 'Quản lý sản phẩm' },
        { path: '/admin/orders', icon: '🛒', label: 'Quản lý đơn hàng' },
        { path: '/admin/categories', icon: '📁', label: 'Quản lý danh mục' },
        { path: '/admin/news', icon: '📰', label: 'Quản lý tin tức' },
        { path: '/admin/users', icon: '👥', label: 'Quản lý người dùng' },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'
                } overflow-hidden`}
        >
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
