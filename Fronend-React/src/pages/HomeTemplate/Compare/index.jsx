import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../../hooks/useCompare';
import { useCart } from '../../../hooks/useCart';

const Compare = () => {
    const navigate = useNavigate();
    const { compareItems, removeFromCompare, clearCompare } = useCompare();
    const { addToCart } = useCart();

    // Debug: Xem dữ liệu sản phẩm
    console.log('Compare Items:', compareItems);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    };

    if (compareItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 sm:pt-20 md:pt-24">
                <div className="container mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
                    <div className="max-w-3xl mx-auto text-center py-12 sm:py-16">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3">Chưa có sản phẩm để so sánh</h1>
                        <p className="text-gray-600 dark:text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">Thêm sản phẩm vào danh sách so sánh để xem chi tiết</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            Khám phá sản phẩm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Tạo danh sách các thuộc tính để so sánh
    const attributes = [
        { key: 'hinh', label: 'Hình ảnh', type: 'image' },
        { key: 'ten_sp', label: 'Tên sản phẩm', type: 'text' },
        { key: 'ten_loai', label: 'Danh mục', type: 'text' },
        { key: 'gia', label: 'Giá gốc', type: 'price' },
        { key: 'gia_km', label: 'Giá khuyến mãi', type: 'price' },
        { key: 'discount', label: 'Giảm giá', type: 'discount' },
        { key: 'mo_ta', label: 'Mô tả', type: 'longtext' },
        { key: 'ram', label: 'RAM', type: 'text' },
        { key: 'cpu', label: 'CPU', type: 'text' },
        { key: 'dia_cung', label: 'Ổ cứng', type: 'text' },
        { key: 'mau_sac', label: 'Màu sắc', type: 'text' },
        { key: 'can_nang', label: 'Cân nặng (kg)', type: 'number' },
        { key: 'luot_xem', label: 'Lượt xem', type: 'number' },
        { key: 'hot', label: 'Sản phẩm HOT', type: 'badge' },
        { key: 'an_hien', label: 'Trạng thái', type: 'status' },
    ];

    const getDiscountPercent = (product) => {
        if (product.gia_km && product.gia && product.gia_km > 0) {
            return Math.round(((product.gia - product.gia_km) / product.gia) * 100);
        }
        return 0;
    };

    const renderCell = (product, attribute) => {
        // Lấy giá trị trực tiếp từ product (thuộc tính đã có sẵn trong database)
        let value = product[attribute.key];

        switch (attribute.type) {
            case 'image':
                return (
                    <div className="w-full aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                        <img
                            src={value || 'https://via.placeholder.com/300'}
                            alt={product.ten_sp}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                );

            case 'price':
                return value > 0 ? (
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(value)}
                    </span>
                ) : (
                    <span className="text-gray-400 dark:text-slate-500">---</span>
                );

            case 'discount': {
                const discount = getDiscountPercent(product);
                return discount > 0 ? (
                    <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                        -{discount}%
                    </span>
                ) : (
                    <span className="text-gray-400 dark:text-slate-500">Không giảm</span>
                );
            }

            case 'badge': {
                return value === 1 ? (
                    <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm animate-pulse">
                        🔥 HOT
                    </span>
                ) : (
                    <span className="text-gray-400 dark:text-slate-500">---</span>
                );
            }

            case 'status': {
                return value === 1 ? (
                    <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                        Đang bán
                    </span>
                ) : (
                    <span className="inline-block bg-gray-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                        Ngừng bán
                    </span>
                );
            }

            case 'number':
                return value ? (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-xl font-bold">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </span>
                ) : (
                    <span className="text-gray-400 dark:text-slate-500">---</span>
                );

            case 'longtext':
                return (
                    <div className="text-sm text-gray-600 dark:text-slate-400 line-clamp-3 text-left p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        {value || 'Chưa có mô tả'}
                    </div>
                );

            case 'text':
                return value ? (
                    <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-xl font-bold">
                        {value}
                    </span>
                ) : (
                    <span className="text-gray-400 dark:text-slate-500">---</span>
                );

            default:
                return (
                    <span className="text-gray-700 dark:text-slate-300">
                        {value || '---'}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 sm:pt-20 md:pt-24">
            <div className="container mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">
                                So sánh sản phẩm
                            </h1>
                            <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm">
                                Đang so sánh {compareItems.length} sản phẩm
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/products')}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-700 transition text-xs sm:text-sm"
                            >
                                Thêm
                            </button>
                            <button
                                onClick={clearCompare}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-slate-700 transition text-xs sm:text-sm"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    </div>
                </div>

                {/* Compare Table */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold text-white w-48 sticky left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Thuộc tính
                                        </div>
                                    </th>
                                    {compareItems.map((product, index) => (
                                        <th key={product.id} className="px-6 py-4 text-center min-w-[300px]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-bold text-lg flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                                        {index + 1}
                                                    </div>
                                                    Sản phẩm {index + 1}
                                                </span>
                                                <button
                                                    onClick={() => removeFromCompare(product.id)}
                                                    className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all flex items-center justify-center group"
                                                    title="Xóa sản phẩm"
                                                >
                                                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Action Row */}
                                <tr className="border-b-2 border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-slate-900/50">
                                    <td className="px-6 py-5 font-bold text-gray-800 dark:text-slate-200 sticky left-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-slate-900/50">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                            </svg>
                                            Thao tác
                                        </div>
                                    </td>
                                    {compareItems.map((product) => (
                                        <td key={product.id} className="px-6 py-5 text-center">
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={() => navigate(`/product/${product.id}`)}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Thêm giỏ hàng
                                                </button>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Attribute Rows */}
                                {attributes.map((attr, index) => (
                                    <tr
                                        key={attr.key}
                                        className={`border-b border-gray-200 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-900/30'
                                            }`}
                                    >
                                        <td className={`px-6 py-4 font-bold text-gray-800 dark:text-slate-200 sticky left-0 ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-900/30'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {attr.key === 'ram' && (
                                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                    </svg>
                                                )}
                                                {attr.key === 'cpu' && (
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                    </svg>
                                                )}
                                                {attr.key === 'dia_cung' && (
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                                    </svg>
                                                )}
                                                {attr.key === 'mau_sac' && (
                                                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                    </svg>
                                                )}
                                                {attr.key === 'can_nang' && (
                                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                    </svg>
                                                )}
                                                {attr.label}
                                            </div>
                                        </td>
                                        {compareItems.map((product) => (
                                            <td key={product.id} className="px-6 py-4 text-center">
                                                {renderCell(product, attr)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Mẹo so sánh</h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Bạn có thể so sánh tối đa 3 sản phẩm cùng lúc</li>
                                <li>• Click vào "Xem chi tiết" để xem thông tin đầy đủ của sản phẩm</li>
                                <li>• Sử dụng chức năng so sánh để chọn sản phẩm phù hợp nhất</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compare;
