import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { donHangAPI } from '../../../services/api';
import Button from '../_components/Button';
import Select from '../_components/Select';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const res = await donHangAPI.getById(id);
                if (res.data?.success) {
                    setOrder(res.data.data);
                    setStatus(res.data.data.trang_thai);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                alert('Có lỗi khi tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async () => {
        try {
            setUpdating(true);
            await donHangAPI.update(id, { trang_thai: status });
            alert('Cập nhật trạng thái thành công');
            window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Có lỗi khi cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center">
                <p className="text-gray-600 dark:text-slate-400">Không tìm thấy đơn hàng</p>
                <Button onClick={() => navigate('/admin/orders')} className="mt-4">
                    Quay lại
                </Button>
            </div>
        );
    }

    const statusOptions = [
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'processing', label: 'Đang xử lý' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

    return (
        <div>
            <div className="mb-6">
                <Button
                    variant="outline"
                    onClick={() => navigate('/admin/orders')}
                    icon={
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    }
                >
                    Quay lại
                </Button>
            </div>

            <div className="space-y-6">
                <div className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Chi tiết đơn hàng #{order.id}
                    </h1>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Thông tin khách hàng
                            </h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-sm text-gray-500 dark:text-slate-400">Họ tên:</dt>
                                    <dd className="text-gray-900 dark:text-white">{order.ho_ten}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500 dark:text-slate-400">Email:</dt>
                                    <dd className="text-gray-900 dark:text-white">{order.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500 dark:text-slate-400">Điện thoại:</dt>
                                    <dd className="text-gray-900 dark:text-white">{order.dien_thoai}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500 dark:text-slate-400">Địa chỉ:</dt>
                                    <dd className="text-gray-900 dark:text-white">{order.dia_chi}</dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Thông tin đơn hàng
                            </h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-sm text-gray-500 dark:text-slate-400">Ngày đặt:</dt>
                                    <dd className="text-gray-900 dark:text-white">
                                        {new Date(order.ngay_dat).toLocaleString('vi-VN')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500 dark:text-slate-400">Tổng tiền:</dt>
                                    <dd className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {formatPrice(order.tong_tien)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500 dark:text-slate-400 mb-2">Trạng thái:</dt>
                                    <dd className="flex gap-2">
                                        <Select
                                            name="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            options={statusOptions}
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="primary"
                                            onClick={handleUpdateStatus}
                                            loading={updating}
                                            disabled={status === order.trang_thai}
                                        >
                                            Cập nhật
                                        </Button>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {order.ghi_chu && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Ghi chú</h3>
                            <p className="text-gray-700 dark:text-slate-300">{order.ghi_chu}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
