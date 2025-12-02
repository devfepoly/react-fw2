import { memo, useCallback } from 'react';
import { useCart } from '../../hooks/useCart';
import { useCompare } from '../../hooks/useCompare';

// Format price - định nghĩa ngoài component để tránh tạo lại mỗi render
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductCard = memo(({ product, onClick }) => {
    const { addToCart } = useCart();
    const { addToCompare, isInCompare } = useCompare();

    const discountPercent = product.gia_km && product.gia
        ? Math.round(((product.gia - product.gia_km) / product.gia) * 100)
        : 0;

    const handleAddToCart = useCallback((e) => {
        e.stopPropagation();
        addToCart(product, 1);

        const button = e.currentTarget;
        const originalText = button.innerHTML;
        button.innerHTML = '<svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
        button.classList.add('bg-green-600');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('bg-green-600');
        }, 1000);
    }, [addToCart, product]);

    const handleCompare = useCallback((e) => {
        e.stopPropagation();
        if (addToCompare(product)) {
            alert('Đã thêm vào danh sách so sánh!');
        }
    }, [addToCompare, product]);

    const handleClick = useCallback(() => {
        onClick && onClick(product.id);
    }, [onClick, product.id]);

    const inCompare = isInCompare(product.id);

    return (
        <div
            onClick={handleClick}
            className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 dark:bg-slate-700 aspect-square">
                <img
                    src={product.hinh || 'https://via.placeholder.com/300'}
                    alt={product.ten_sp}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
                    {product.hot === 1 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full animate-pulse">
                            HOT
                        </span>
                    )}
                    {discountPercent > 0 && (
                        <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                {/* Quick View */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold text-sm sm:text-base transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Xem chi tiet
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex flex-col grow">
                {/* Category */}
                {product.ten_loai && (
                    <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">
                        {product.ten_loai}
                    </span>
                )}

                {/* Title */}
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-slate-100 mt-1.5 sm:mt-2 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-10 sm:min-h-14">
                    {product.ten_sp}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-auto">
                    {product.gia_km > 0 ? (
                        <>
                            <span className="text-lg sm:text-xl font-bold text-red-500">
                                {formatPrice(product.gia_km)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-400 dark:text-slate-400 line-through">
                                {formatPrice(product.gia)}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg sm:text-xl font-bold text-blue-500">
                            {formatPrice(product.gia)}
                        </span>
                    )}
                </div>

                {/* Stats & Actions */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-300 border-t border-gray-100 dark:border-slate-700 pt-2 sm:pt-3">
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden sm:inline">{product.luot_xem || 0} luot xem</span>
                            <span className="sm:hidden">{product.luot_xem || 0}</span>
                        </div>
                        <button
                            onClick={handleCompare}
                            className={`${inCompare
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                                } hover:bg-green-700 hover:text-white px-2 py-1.5 rounded-lg transition-all flex items-center gap-1 font-medium text-xs`}
                            title={inCompare ? 'Da them so sanh' : 'So sanh'}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="hidden sm:inline">{inCompare ? 'OK' : 'So sanh'}</span>
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-medium text-xs sm:text-sm"
                        title="Them vao gio hang"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Them vao gio</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
