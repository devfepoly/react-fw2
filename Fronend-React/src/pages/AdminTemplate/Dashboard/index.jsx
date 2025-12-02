import { useState, useEffect } from 'react';
import { sanPhamAPI, donHangAPI, usersAPI, loaiAPI } from '../../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalCategories: 0,
        loading: true
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [products, orders, users, categories] = await Promise.all([
                sanPhamAPI.getAll(),
                donHangAPI.getAll(),
                usersAPI.getAll(),
                loaiAPI.getAll()
            ]);

            setStats({
                totalProducts: products.data?.data?.length || 0,
                totalOrders: orders.data?.data?.length || 0,
                totalUsers: users.data?.data?.length || 0,
                totalCategories: categories.data?.data?.length || 0,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`rounded-lg bg-white dark:bg-slate-800 p-6 shadow-lg border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {stats.loading ? '...' : value}
                    </p>
                </div>
                <div className={`rounded-full p-3 ${color.replace('border', 'bg').replace('500', '100')}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    title="Tổng sản phẩm"
                    value={stats.totalProducts}
                    color="border-blue-500"
                    icon={
                        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />

                <StatCard
                    title="Tổng đơn hàng"
                    value={stats.totalOrders}
                    color="border-green-500"
                    icon={
                        <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    }
                />

                <StatCard
                    title="Tổng người dùng"
                    value={stats.totalUsers}
                    color="border-purple-500"
                    icon={
                        <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                />

                <StatCard
                    title="Tổng danh mục"
                    value={stats.totalCategories}
                    color="border-yellow-500"
                    icon={
                        <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    }
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Hoạt động gần đây
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                        Chức năng đang được phát triển...
                    </p>
                </div>

                <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Thống kê nhanh
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                        Chức năng đang được phát triển...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
