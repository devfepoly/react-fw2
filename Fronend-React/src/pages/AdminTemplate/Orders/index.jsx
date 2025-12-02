import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donHangAPI } from '../../../services/api';
import Table from '../_components/Table';
import Button from '../_components/Button';
import Modal from '../_components/Modal';
import Pagination from '../../../components/common/Pagination';

const ITEMS_PER_PAGE = 10;

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, []);

    // Phân trang
    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const paginatedOrders = orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await donHangAPI.getAll();
            setOrders(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Có lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.order) return;

        try {
            await donHangAPI.delete(deleteModal.order.id);
            alert('Xóa đơn hàng thành công');
            setDeleteModal({ isOpen: false, order: null });
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Có lỗi khi xóa đơn hàng');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        { header: 'Mã ĐH', accessor: 'id' },
        {
            header: 'Người đặt',
            render: (row) => (
                <div>
                    <div className="font-medium">{row.ho_ten}</div>
                    <div className="text-sm text-gray-500">{row.email}</div>
                </div>
            )
        },
        {
            header: 'Điện thoại',
            accessor: 'dien_thoai'
        },
        {
            header: 'Tổng tiền',
            render: (row) => formatPrice(row.tong_tien || 0)
        },
        {
            header: 'Trạng thái',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.trang_thai)}`}>
                    {row.trang_thai === 'pending' ? 'Chờ xử lý' :
                        row.trang_thai === 'processing' ? 'Đang xử lý' :
                            row.trang_thai === 'completed' ? 'Hoàn thành' :
                                row.trang_thai === 'cancelled' ? 'Đã hủy' : row.trang_thai}
                </span>
            )
        },
        {
            header: 'Ngày đặt',
            render: (row) => formatDate(row.ngay_dat)
        }
    ];

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Quản lý đơn hàng
                </h1>
            </div>

            <Table
                columns={columns}
                data={paginatedOrders}
                isLoading={loading}
                onView={(order) => navigate(`/admin/orders/${order.id}`)}
                onDelete={(order) => setDeleteModal({ isOpen: true, order })}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, order: null })}
                title="Xác nhận xóa"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-slate-400">
                        Bạn có chắc chắn muốn xóa đơn hàng <strong>#{deleteModal.order?.id}</strong>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ isOpen: false, order: null })}
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

export default Orders;
