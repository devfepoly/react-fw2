import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { sanPhamAPI, loaiAPI } from '../../../services/api';
import ProductCard from '../../../components/product/ProductCard';
import CategoryFilter from '../../../components/product/CategoryFilter';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import { filterProducts, sortProducts } from '../../../utils/productUtils';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [quickFilters, setQuickFilters] = useState({ hot: false, discount: false });
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [itemsPerPage] = useState(9); // 9 sản phẩm mỗi trang
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');

    // Lấy page từ URL, mặc định là 1
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const syncParams = useCallback(({ page = '1', search } = {}) => {
        const effectiveSearch = typeof search === 'string' ? search : searchTerm;
        const params = {};
        const trimmed = effectiveSearch.trim();
        if (trimmed) {
            params.search = trimmed;
        }
        params.page = page.toString();
        setSearchParams(params);
    }, [searchTerm, setSearchParams]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const nextSearch = searchParams.get('search') || '';
        setSearchTerm((prev) => (prev === nextSearch ? prev : nextSearch));
    }, [searchParams]);

    useEffect(() => {
        if (!id) {
            setSelectedCategory(null);
            return;
        }
        const categoryId = Number(id);
        if (!Number.isNaN(categoryId)) {
            setSelectedCategory(categoryId);
            syncParams({ page: '1' });
        }
    }, [id, syncParams]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                sanPhamAPI.getAll(),
                loaiAPI.getAll()
            ]);

            if (productsRes.data.success) {
                setProducts(productsRes.data.data);
            }

            if (categoriesRes.data.success) {
                setCategories(categoriesRes.data.data.filter(cat => cat.an_hien === 1));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterByCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        syncParams({ page: '1' });
    };

    const handlePriceFilter = (range) => {
        setPriceFilter(range);
        syncParams({ page: '1' });
    };

    const handleSort = (value) => {
        setSortBy(value);
    };

    const handleQuickFilterToggle = (key) => {
        setQuickFilters((prev) => ({ ...prev, [key]: !prev[key] }));
        syncParams({ page: '1' });
    };

    const handleSearchInput = (value) => {
        setSearchTerm(value);
        syncParams({ page: '1', search: value });
    };

    const filteredProducts = useMemo(() => {
        const filtered = filterProducts(products, {
            categoryId: selectedCategory,
            minPrice: priceFilter.min,
            maxPrice: priceFilter.max,
            searchTerm,
            onlyHot: quickFilters.hot,
            onlyDiscount: quickFilters.discount,
        });
        return sortProducts(filtered, sortBy);
    }, [products, selectedCategory, priceFilter, searchTerm, quickFilters, sortBy]);

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        syncParams({ page: pageNumber.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 sm:pt-24 md:pt-28 lg:pt-32 transition-colors">
            {/* Page Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm mb-6 sm:mb-8 border-b border-gray-100 dark:border-slate-700">
                <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-1 sm:mb-2">
                                {selectedCategory
                                    ? categories.find(c => c.id === selectedCategory)?.ten_loai
                                    : 'Tất cả sản phẩm'}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300">
                                Tìm thấy {filteredProducts.length} sản phẩm
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full lg:w-auto">
                            {/* Search input */}
                            <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md lg:ml-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => handleSearchInput(e.target.value)}
                                        placeholder="Tìm kiếm theo tên sản phẩm..."
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm sm:text-base focus:border-blue-500 focus:outline-none dark:bg-slate-900/60 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400"
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => handleSearchInput('')}
                                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-red-500"
                                            aria-label="Xóa tìm kiếm"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                <button onClick={() => navigate('/')} className="hover:text-blue-600">
                                    Trang chủ
                                </button>
                                <span>/</span>
                                <span className="text-blue-600 font-semibold">Sản phẩm</span>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    {/* Sidebar Filter */}
                    <aside className="w-full lg:w-1/4">
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={filterByCategory}
                            onPriceFilter={handlePriceFilter}
                            priceFilter={priceFilter}
                            sortBy={sortBy}
                            onSortChange={handleSort}
                            quickFilters={quickFilters}
                            onQuickFilterToggle={handleQuickFilterToggle}
                        />
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                                    {currentProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onClick={(id) => navigate(`/product/${id}`)}
                                        />
                                    ))}
                                </div>

                                {/* Pagination Component */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={paginate}
                                />

                                {/* Pagination Info */}
                                <div className="mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                    Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16 sm:py-20">
                                <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-slate-200 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400">Vui lòng thử lại với bộ lọc khác</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
