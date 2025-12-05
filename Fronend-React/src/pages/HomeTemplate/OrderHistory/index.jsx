import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { donHangAPI } from '../../../services/api';
import Loading from '../../../components/common/Loading';

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        if (!user) {
            return;
        }
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching orders for user:', user);
            const response = await donHangAPI.getByUserId(user.id);
            console.log('Orders response:', response.data);

            // Xử lý data có thể ở nhiều format khác nhau
            const orderData = response.data.data || response.data || [];
            setOrders(Array.isArray(orderData) ? orderData : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            console.error('Error details:', error.response?.data);
            setOrders([]); // Set empty array nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

    const viewOrderDetail = async (orderId) => {
        try {
            const response = await donHangAPI.getById(orderId);
            setSelectedOrder(response.data.data);
        } catch (error) {
            console.error('Error fetching order detail:', error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusText = (status) => {
        const statusMap = {
            0: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
            1: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
            2: { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
            3: { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
            4: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' }
        };
        return statusMap[status] || statusMap[0];
    };

    // Hiển thị loading khi đang fetch orders
    if (loading && isAuthenticated) {
        console.log('OrderHistory - Showing orders loading...');
        return <Loading />;
    }

    // Nếu chưa đăng nhập hoặc không có user, hiển thị form đăng nhập
    if (!isAuthenticated || !user) {
        console.log('OrderHistory - Showing login prompt');
        return (
            <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
                <div className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                                Đăng nhập để xem lịch sử đơn hàng
                            </h2>
                            <p className="text-gray-600 dark:text-slate-400 text-base">
                                Bạn cần đăng nhập để theo dõi và quản lý các đơn hàng của mình
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Đăng nhập ngay
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-3 rounded-xl font-semibold transition-all"
                            >
                                Đăng ký tài khoản mới
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white py-2 rounded-lg transition"
                            >
                                ← Về trang chủ
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-yellow-800 mb-1">
                                        Lưu ý cho khách vãng lai
                                    </p>
                                    <p className="text-xs text-yellow-700">
                                        Nếu bạn đã đặt hàng không cần đăng nhập, vui lòng lưu mã đơn hàng để tra cứu.
                                        Hoặc đăng ký tài khoản để quản lý đơn hàng dễ dàng hơn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
            <div className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
                {/* Header */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                                Lịch sử đơn hàng
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Bạn có {orders.length} đơn hàng
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h2>
                        <p className="text-gray-600 mb-6">Hãy bắt đầu mua sắm ngay hôm nay!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Khám phá sản phẩm
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = getStatusText(order.trang_thai);
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                                >
                                    <div className="p-4 sm:p-6">
                                        {/* Order Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                                        Đơn hàng #{order.id}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-xs sm:text-sm">
                                                    {formatDate(order.thoi_diem_mua)}
                                                </p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-gray-600 text-sm mb-1">Tổng tiền</p>
                                                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                                                    {formatPrice(order.tong_tien)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Info */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                            <div>
                                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Người nhận</p>
                                                <p className="font-semibold text-gray-800">{order.ho_ten}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Số điện thoại</p>
                                                <p className="font-semibold text-gray-800">{order.sdt || 'Chưa có'}</p>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <p className="text-gray-600 text-xs sm:text-sm mb-1">Địa chỉ giao hàng</p>
                                                <p className="font-semibold text-gray-800">{order.dia_chi}</p>
                                            </div>
                                            {order.ghi_chu && (
                                                <div className="sm:col-span-2">
                                                    <p className="text-gray-600 text-xs sm:text-sm mb-1">Ghi chú</p>
                                                    <p className="text-gray-700 italic">{order.ghi_chu}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => viewOrderDetail(order.id)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                                            >
                                                Xem chi tiết
                                            </button>
                                            {order.trang_thai === 0 && (
                                                <button
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                                                >
                                                    Hủy đơn hàng
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                Chi tiết đơn hàng #{selectedOrder.id}
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
                            {/* Order Products */}
                            {selectedOrder.chi_tiet && selectedOrder.chi_tiet.length > 0 ? (
                                <div className="space-y-4 mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm đã đặt</h3>
                                    {selectedOrder.chi_tiet.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.hinh || 'https://via.placeholder.com/100'}
                                                alt={item.ten_sp}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 mb-2">{item.ten_sp}</h4>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Số lượng: {item.so_luong}</span>
                                                    <span className="font-bold text-blue-600">
                                                        {formatPrice(item.gia * item.so_luong)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Không có chi tiết sản phẩm</p>
                            )}

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                    <span>Tổng cộng:</span>
                                    <span className="text-blue-600">{formatPrice(selectedOrder.tong_tien)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
