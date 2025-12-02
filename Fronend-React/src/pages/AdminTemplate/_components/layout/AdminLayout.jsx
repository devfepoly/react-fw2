import { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex pt-16">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main
                    className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'
                        }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
