import { useState, useEffect } from 'react';
import { usersAPI } from '../../../services/api';
import Table from '../_components/Table';
import Button from '../_components/Button';
import Modal from '../_components/Modal';
import Pagination from '../../../components/common/Pagination';

const ITEMS_PER_PAGE = 10;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Phân trang
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await usersAPI.getAll();
            setUsers(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.user) return;

        try {
            await usersAPI.delete(deleteModal.user.id);
            alert('Xóa người dùng thành công');
            setDeleteModal({ isOpen: false, user: null });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Có lỗi khi xóa người dùng');
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên người dùng', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Điện thoại', accessor: 'dien_thoai' },
        {
            header: 'Vai trò',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                    {row.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </span>
            )
        },
        {
            header: 'Ngày tạo',
            render: (row) => new Date(row.created_at).toLocaleDateString('vi-VN')
        }
    ];

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Quản lý người dùng
                </h1>
            </div>

            <Table
                columns={columns}
                data={paginatedUsers}
                isLoading={loading}
                onDelete={(user) => setDeleteModal({ isOpen: true, user })}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, user: null })}
                title="Xác nhận xóa"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-slate-400">
                        Bạn có chắc chắn muốn xóa người dùng <strong>{deleteModal.user?.name}</strong>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ isOpen: false, user: null })}
                        >
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Users;
