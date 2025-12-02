import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sanPhamAPI } from '../../../services/api';
import { useCart } from '../../../hooks/useCart';
import { formatPrice, calculateDiscountPercent } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await sanPhamAPI.getById(id);
                if (response.data.success) {
                    setProduct(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    const discountPercent = calculateDiscountPercent(product?.gia, product?.gia_km);

    if (loading) return <Loading />;
    if (!product) return <div className="text-center py-20 text-gray-700 dark:text-slate-200">Không tìm thấy sản phẩm</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:text-slate-100 pt-20 sm:pt-24 md:pt-28 lg:pt-32 transition-colors">
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-slate-800 shadow-sm mb-6 sm:mb-8 border-b border-gray-100 dark:border-slate-700">
                <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                        <button onClick={() => navigate('/')} className="hover:text-blue-600">Trang chủ</button>
                        <span>/</span>
                        <button onClick={() => navigate('/products')} className="hover:text-blue-600">Sản phẩm</button>
                        <span>/</span>
                        <span className="text-blue-500 font-semibold">{product.ten_sp}</span>
                    </nav>
                </div>
            </div>

            {/* Product Detail */}
            <div className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
                        {/* Product Image */}
                        <div className="relative">
                            <div className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg sm:rounded-xl overflow-hidden">
                                <img
                                    src={product.hinh || 'https://via.placeholder.com/600'}
                                    alt={product.ten_sp}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                                {product.hot === 1 && (
                                    <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full animate-pulse">
                                        🔥 HOT
                                    </span>
                                )}
                                {discountPercent > 0 && (
                                    <span className="bg-yellow-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                                        Giảm {discountPercent}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            {/* Category */}
                            {product.ten_loai && (
                                <span className="text-xs sm:text-sm text-blue-400 font-semibold uppercase tracking-wide mb-2">
                                    {product.ten_loai}
                                </span>
                            )}

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-3 sm:mb-4">
                                {product.ten_sp}
                            </h1>

                            {/* Stats */}
                            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span>4.8/5 (128 đánh giá)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{product.luot_xem || 0} lượt xem</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="bg-gray-50 dark:bg-slate-900/40 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                                <div className="flex items-center gap-3 sm:gap-4 mb-2">
                                    {product.gia_km > 0 ? (
                                        <>
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">
                                                {formatPrice(product.gia_km)}
                                            </span>
                                            <span className="text-lg sm:text-xl text-gray-400 dark:text-slate-400 line-through">
                                                {formatPrice(product.gia)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500">
                                            {formatPrice(product.gia)}
                                        </span>
                                    )}
                                </div>
                                {discountPercent > 0 && (
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                        Tiết kiệm {formatPrice(product.gia - product.gia_km)}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            {product.mo_ta && (
                                <div className="mb-4 sm:mb-6">
                                    <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2 text-sm sm:text-base">Mô tả sản phẩm:</h3>
                                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">{product.mo_ta}</p>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-4 sm:mb-6">
                                <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3 text-sm sm:text-base">Số lượng:</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="px-3 py-2 sm:px-5 sm:py-3 hover:bg-gray-100 transition border-r border-gray-300 dark:border-slate-600 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={quantity <= 1}
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-bold min-w-[50px] sm:min-w-[60px] text-center bg-gray-50 dark:bg-slate-900/40">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="px-3 py-2 sm:px-5 sm:py-3 hover:bg-gray-100 transition border-l border-gray-300 dark:border-slate-600 dark:hover:bg-slate-800"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    <span className="text-xs sm:text-sm text-green-600 font-semibold">✓ Còn hàng</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 ${addedToCart ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-6 sm:py-4 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Đã thêm vào giỏ!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Thêm vào giỏ
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                                >
                                    Mua ngay
                                </button>
                            </div>

                            {/* Features */}
                            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200">Chính hãng 100%</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">Thanh toán an toàn</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <span className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-200">Miễn phí vận chuyển</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-xs sm:text-sm font-medium text-yellow-800 dark:text-yellow-200">Đổi trả 30 ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
