import { useEffect, useState } from 'react';

const CategoryFilter = ({
    categories,
    selectedCategory,
    onCategoryChange,
    onPriceFilter,
    priceFilter = { min: '', max: '' },
    sortBy,
    onSortChange,
    quickFilters = { hot: false, discount: false },
    onQuickFilterToggle = () => { }
}) => {
    const [priceRange, setPriceRange] = useState(priceFilter);

    useEffect(() => {
        setPriceRange(priceFilter);
    }, [priceFilter]);

    const handlePriceFilter = () => {
        onPriceFilter(priceRange);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-gray-800 dark:text-slate-100">Bộ lọc</span>
            </h3>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Danh mục</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    <button
                        onClick={() => onCategoryChange(null)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedCategory === null
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-slate-700/60 dark:text-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        <span className="font-medium">Tất cả sản phẩm</span>
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedCategory === category.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-slate-700/60 dark:text-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            <span className="font-medium">{category.ten_loai}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Khoảng giá</h4>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Giá từ"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-slate-900/40 dark:border-slate-600 dark:text-slate-100"
                    />
                    <input
                        type="number"
                        placeholder="Đến"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-slate-900/40 dark:border-slate-600 dark:text-slate-100"
                    />
                    <button
                        onClick={handlePriceFilter}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* Sort */}
            <div>
                <h4 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Sắp xếp theo</h4>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer dark:bg-slate-900/40 dark:border-slate-600 dark:text-slate-100"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="popular">Phổ biến nhất</option>
                    <option value="name-asc">Tên A-Z</option>
                    <option value="name-desc">Tên Z-A</option>
                </select>
            </div>

            {/* Quick Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Lọc nhanh</h4>
                <div className="space-y-2">
                    <button
                        onClick={() => onQuickFilterToggle('hot')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${quickFilters.hot
                            ? 'bg-red-500 text-white'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/20'
                            }`}
                    >
                        🔥 Sản phẩm Hot
                    </button>
                    <button
                        onClick={() => onQuickFilterToggle('discount')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${quickFilters.discount
                            ? 'bg-yellow-500 text-white'
                            : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-transparent dark:text-yellow-300 dark:hover:bg-yellow-500/20'
                            }`}
                    >
                        ⚡ Giảm giá
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;
