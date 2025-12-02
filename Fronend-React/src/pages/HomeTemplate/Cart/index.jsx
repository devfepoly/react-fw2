import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { authService } from '../../../services/auth.service';
import { donHangAPI } from '../../../services/api';
import { formatPrice, getFinalPrice, isValidPhone, isValidEmail } from '../../../utils/formatters';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [orderForm, setOrderForm] = useState({
        ho_ten: '',
        email: '',
        sdt: '',
        dia_chi: '',
        ghi_chu: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = () => {
        // Điền sẵn thông tin user nếu đã đăng nhập
        if (isAuthenticated && user) {
            setOrderForm({
                ho_ten: user.ho_ten || '',
                email: user.email || '',
                sdt: user.dien_thoai || '',
                dia_chi: user.dia_chi || '',
                ghi_chu: ''
            });
        } else {
            // Khách vãng lai - form trống
            setOrderForm({
                ho_ten: '',
                email: '',
                sdt: '',
                dia_chi: '',
                ghi_chu: ''
            });
        }
        setShowCheckoutModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        // Validate
        if (!orderForm.ho_ten.trim()) {
            alert('Vui lòng nhập họ tên!');
            return;
        }
        if (!orderForm.sdt.trim()) {
            alert('Vui lòng nhập số điện thoại!');
            return;
        }
        if (!isValidPhone(orderForm.sdt)) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }
        if (orderForm.email && !isValidEmail(orderForm.email)) {
            alert('Email không hợp lệ!');
            return;
        }
        if (!orderForm.dia_chi.trim()) {
            alert('Vui lòng nhập địa chỉ giao hàng!');
            return;
        }

        try {
            setIsProcessing(true);

            // Chuẩn bị dữ liệu đơn hàng
            const orderData = {
                don_hang: {
                    ho_ten: orderForm.ho_ten.trim(),
                    email: orderForm.email.trim() || '',
                    sdt: orderForm.sdt.trim(),
                    dia_chi: orderForm.dia_chi.trim(),
                    ghi_chu: orderForm.ghi_chu.trim() || '',
                    id_user: isAuthenticated && user ? user.id : null, // null nếu khách vãng lai
                    tong_tien: getTotalPrice(),
                    trang_thai: 0 // 0 = Chờ xác nhận
                    // Không cần gửi thoi_diem_mua - backend sẽ tự động dùng NOW()
                },
                chi_tiet: cartItems.map(item => ({
                    id_sp: item.id,
                    so_luong: item.quantity
                }))
            };

            console.log('Sending order data:', orderData);

            // Gọi API tạo đơn hàng
            const response = await donHangAPI.create(orderData);

            console.log('Order response:', response.data);

            if (response.data && response.data.success) {
                const orderMessage = isAuthenticated
                    ? `Đặt hàng thành công! 
                
Mã đơn hàng: #${response.data.id}
Tổng tiền: ${formatPrice(getTotalPrice())}

Bạn có thể theo dõi đơn hàng tại trang "Lịch sử đơn hàng"`
                    : `Đặt hàng thành công! 
                
Mã đơn hàng: #${response.data.id}
Tổng tiền: ${formatPrice(getTotalPrice())}
Người nhận: ${orderForm.ho_ten}
Số điện thoại: ${orderForm.sdt}

⚠️ Lưu ý: Vui lòng lưu mã đơn hàng để tra cứu.
Đăng ký tài khoản để quản lý đơn hàng dễ dàng hơn!`;

                alert(orderMessage);

                clearCart(); // Xóa giỏ hàng
                setShowCheckoutModal(false);

                // Nếu đã đăng nhập, chuyển đến trang lịch sử đơn hàng
                // Nếu chưa đăng nhập, về trang chủ
                if (isAuthenticated) {
                    navigate('/order-history');
                } else {
                    // Hỏi user có muốn đăng ký không
                    const wantRegister = confirm('Bạn có muốn đăng ký tài khoản để theo dõi đơn hàng không?');
                    if (wantRegister) {
                        navigate('/register');
                    } else {
                        navigate('/');
                    }
                }
            } else {
                alert('Có lỗi xảy ra: ' + (response.data?.message || 'Không thể đặt hàng'));
            }
        } catch (error) {
            console.error('Error creating order:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Không thể đặt hàng';
            alert('Lỗi: ' + errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
                <div className="container mx-auto px-4 sm:px-6 pb-16">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Giỏ hàng trống
                        </h1>
                        <p className="text-gray-600 dark:text-slate-300 mb-8 text-base sm:text-lg">
                            Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Khám phá sản phẩm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
            <div className="container mx-auto px-4 sm:px-6 pb-16">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Giỏ hàng của bạn
                            </h1>
                            <p className="text-gray-600 dark:text-slate-300 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="font-medium">{cartItems.length} sản phẩm</span>
                            </p>
                        </div>
                        <button
                            onClick={clearCart}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Xóa tất cả</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const price = getFinalPrice(item);
                            const itemTotal = price * item.quantity;
                            const hasDiscount = item.gia_km > 0;

                            return (
                                <div key={item.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-slate-700 overflow-hidden group">
                                    <div className="p-6">
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div
                                                className="relative w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl overflow-hidden shrink-0 cursor-pointer shadow-md"
                                                onClick={() => navigate(`/product/${item.id}`)}
                                            >
                                                <img
                                                    src={item.hinh || 'https://via.placeholder.com/150'}
                                                    alt={item.ten_sp}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {hasDiscount && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                                                        SALE
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start gap-4 mb-4">
                                                    <h3
                                                        className="text-lg sm:text-xl font-bold text-gray-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition line-clamp-2 flex-1"
                                                        onClick={() => navigate(`/product/${item.id}`)}
                                                    >
                                                        {item.ten_sp}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                                                        title="Xóa sản phẩm"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                            {formatPrice(price)}
                                                        </span>
                                                        {hasDiscount && (
                                                            <span className="text-sm text-gray-400 dark:text-slate-500 line-through">
                                                                {formatPrice(item.gia)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quantity & Total */}
                                                <div className="flex items-center justify-between gap-4 mt-auto">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">Số lượng:</span>
                                                        <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden shadow-inner">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-10 h-10 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                                </svg>
                                                            </button>

                                                            <div className="px-4 h-10 flex items-center justify-center min-w-12 bg-white dark:bg-slate-800 border-x-2 border-gray-200 dark:border-slate-600">
                                                                <span className="font-bold text-lg text-gray-800 dark:text-slate-100">
                                                                    {item.quantity}
                                                                </span>
                                                            </div>

                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-10 h-10 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Item Total */}
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Thành tiền</p>
                                                        <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                            {formatPrice(itemTotal)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-24 border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Đơn hàng</h2>
                            </div>

                            {/* Summary Details */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                    <span className="text-gray-600 dark:text-slate-300">Tạm tính</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100">{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                    <span className="text-gray-600 dark:text-slate-300">Phí vận chuyển</span>
                                    <span className="font-bold text-green-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Miễn phí
                                    </span>
                                </div>
                                <div className="border-t-2 border-gray-200 dark:border-slate-600 pt-4">
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                                        <span className="text-lg font-bold text-gray-800 dark:text-slate-100">Tổng cộng</span>
                                        <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {formatPrice(getTotalPrice())}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-dashed border-yellow-300 dark:border-yellow-700">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Mã giảm giá
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã khuyến mãi"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                                    />
                                    <button className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                                        Áp dụng
                                    </button>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-2xl hover:shadow-blue-500/50 mb-4 flex items-center justify-center gap-3 group"
                            >
                                <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Thanh toán ngay</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>

                            {/* Continue Shopping */}
                            <button
                                onClick={() => navigate('/products')}
                                className="w-full border-2 border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white/50 dark:bg-slate-700/50 text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 py-3 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Tiếp tục mua sắm</span>
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t dark:border-slate-700 space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>Bảo mật thanh toán</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Miễn phí đổi trả trong 30 ngày</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>Giao hàng nhanh chóng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-100 dark:border-slate-700">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">
                                    Thông tin đặt hàng
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowCheckoutModal(false)}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white transition-all flex items-center justify-center group"
                                disabled={isProcessing}
                            >
                                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6">
                            {/* Thông báo cho khách vãng lai */}
                            {!isAuthenticated && (
                                <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-base text-blue-900 dark:text-blue-100 font-bold">Đặt hàng nhanh không cần tài khoản</p>
                                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                                                Bạn có thể{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowCheckoutModal(false);
                                                        navigate('/login');
                                                    }}
                                                    className="underline font-bold hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                                                >
                                                    đăng nhập
                                                </button>
                                                {' '}để theo dõi đơn hàng dễ dàng hơn
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thông báo cho user đã đăng nhập */}
                            {isAuthenticated && (
                                <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-base text-green-900 dark:text-green-100 font-bold">Thông tin của bạn đã được tự động điền</p>
                                            <p className="text-sm text-green-700 dark:text-green-300 mt-2">Kiểm tra và chỉnh sửa nếu cần trước khi đặt hàng</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="space-y-5 mb-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Họ tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ho_ten"
                                        value={orderForm.ho_ten}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                                        placeholder="Nhập họ tên người nhận"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
                                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={orderForm.email}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-all shadow-sm hover:shadow-md"
                                        placeholder="Nhập email (tùy chọn)"
                                        disabled={isProcessing}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="sdt"
                                        value={orderForm.sdt}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-all shadow-sm hover:shadow-md"
                                        placeholder="Nhập số điện thoại"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Địa chỉ giao hàng <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="dia_chi"
                                        value={orderForm.dia_chi}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-all shadow-sm hover:shadow-md resize-none"
                                        placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
                                        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Ghi chú
                                    </label>
                                    <textarea
                                        name="ghi_chu"
                                        value={orderForm.ghi_chu}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-5 py-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 transition-all shadow-sm hover:shadow-md resize-none"
                                        placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 mb-6 border-2 border-gray-200 dark:border-slate-600 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100">Tóm tắt đơn hàng</h3>
                                </div>
                                <div className="space-y-3 mb-4">
                                    {cartItems.map(item => {
                                        const price = getFinalPrice(item);
                                        return (
                                            <div key={item.id} className="flex justify-between items-center p-3 bg-white/70 dark:bg-slate-800/70 rounded-xl">
                                                <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">
                                                    {item.ten_sp} <span className="text-blue-600 dark:text-blue-400">x {item.quantity}</span>
                                                </span>
                                                <span className="font-bold text-gray-800 dark:text-slate-100">
                                                    {formatPrice(price * item.quantity)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="border-t-2 border-gray-300 dark:border-slate-600 pt-4">
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                                        <span className="font-bold text-lg text-gray-800 dark:text-slate-100">Tổng cộng</span>
                                        <span className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {formatPrice(getTotalPrice())}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="flex-1 border-2 border-gray-300 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-400 bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                                    disabled={isProcessing}
                                >
                                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Xác nhận đặt hàng
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
