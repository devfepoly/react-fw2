import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sanPhamAPI } from '@services/api';
import { authService } from '@services/auth.service';
import { useCart } from '@/hooks/useCart';
import { useCompare } from '@/hooks/useCompare';

const HomeHeader = ({ isDark, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getCurrentUser());
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    const { getTotalItems } = useCart();
    const { compareCount } = useCompare();

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        navigate('/');
    };

    useEffect(() => {
        fetchAllProducts();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await sanPhamAPI.getAll();
            if (response.data.success) {
                setAllProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 0) {
            const filtered = allProducts.filter(product =>
                product.ten_sp.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setSearchResults(filtered);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setShowSearchResults(false);
            setSearchQuery('');
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setShowSearchResults(false);
        setSearchQuery('');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg dark:bg-slate-900/95'
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950'
            }`}>
            {/* Top bar - chỉ hiện khi chưa scroll */}
            {!isScrolled && (
                <div className="border-b border-white/20 dark:border-slate-700">
                    <div className="container mx-auto px-4 flex justify-between items-center text-sm py-2">
                        <div className="flex items-center gap-4 text-white">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Hotline: 0123-456-789
                            </span>
                            <span className="hidden md:flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                support@shop.com
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-white text-xs">🔥 Hot Deal: Giảm đến 50%!</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main header */}
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform ${isScrolled
                            ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                            : 'bg-white/20 backdrop-blur-md'
                            }`}>
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className={`text-xl font-bold ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`}>
                                ShopOnline
                            </h1>
                            <p className={`text-xs hidden md:block ${isScrolled ? 'text-gray-500 dark:text-slate-400' : 'text-white/80'}`}>
                                Your Shopping Partner
                            </p>
                        </div>
                    </Link>

                    {/* Search bar */}
                    <div className="hidden lg:flex flex-1 max-w-xl mx-4">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                                className={`w-full px-4 py-2.5 rounded-full focus:outline-none transition-all text-sm ${isScrolled
                                    ? 'bg-gray-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-gray-900 dark:text-white'
                                    : 'bg-white/90 backdrop-blur-md text-gray-900 border-2 border-white/50 focus:border-white'
                                    }`}
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full hover:shadow-lg transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50">
                                    <div className="p-2">
                                        {searchResults.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleProductClick(product.id)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition text-left"
                                            >
                                                <div className="w-12 h-12 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={product.hinh || 'https://via.placeholder.com/50'}
                                                        alt={product.ten_sp}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                        {product.ten_sp}
                                                    </h4>
                                                    <p className="text-sm font-bold text-blue-600">
                                                        {formatPrice(product.gia_km > 0 ? product.gia_km : product.gia)}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition ${isScrolled
                                ? 'border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                                }`}
                            title={isDark ? 'Light Mode' : 'Dark Mode'}
                        >
                            {isDark ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3v2m0 14v2m7-9h2M3 12H1m15.364-6.364l1.414 1.414M6.222 17.778l-1.414 1.414m0-12.728L6.222 6.95m10.556 10.828l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                                </svg>
                            )}
                        </button>

                        {/* Compare */}
                        <Link to="/compare" className="relative group">
                            <div className={`p-2 rounded-full transition ${isScrolled
                                ? 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                : 'hover:bg-white/20'
                                }`}>
                                <svg className={`w-6 h-6 transition ${isScrolled
                                    ? 'text-gray-700 dark:text-slate-100 group-hover:text-blue-600'
                                    : 'text-white'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {compareCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {compareCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative group">
                            <div className={`p-2 rounded-full transition ${isScrolled
                                ? 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                : 'hover:bg-white/20'
                                }`}>
                                <svg className={`w-6 h-6 transition ${isScrolled
                                    ? 'text-gray-700 dark:text-slate-100 group-hover:text-blue-600'
                                    : 'text-white'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center gap-2 p-2 rounded-lg transition ${isScrolled
                                        ? 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                        : 'hover:bg-white/20'
                                        }`}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className={`hidden lg:block font-medium text-sm ${isScrolled ? 'text-gray-700 dark:text-slate-100' : 'text-white'
                                        }`}>{user?.name}</span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50">
                                        <Link
                                            to="/order-history"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Lịch sử đơn hàng
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${isScrolled
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                                    : 'bg-white text-blue-600 hover:bg-white/90'
                                    }`}
                            >
                                <span>Đăng nhập</span>
                            </Link>
                        )}

                        <button
                            className={`md:hidden p-2 rounded-lg ${isScrolled
                                ? 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-100'
                                : 'hover:bg-white/20 text-white'
                                }`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`border-t ${isScrolled
                ? 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                : 'border-white/20 bg-black/10'
                }`}>
                <div className="container mx-auto px-4">
                    <div className={`md:flex items-center justify-between ${isMenuOpen ? 'block' : 'hidden md:flex'}`}>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 py-2">
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${isActive('/')
                                    ? isScrolled
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-white/20 backdrop-blur-md text-white'
                                    : isScrolled
                                        ? 'text-gray-700 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Trang chủ
                            </Link>

                            <Link
                                to="/products"
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${isActive('/products')
                                    ? isScrolled
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-white/20 backdrop-blur-md text-white'
                                    : isScrolled
                                        ? 'text-gray-700 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Sản phẩm
                            </Link>

                            <Link
                                to="/news"
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${isActive('/news')
                                    ? isScrolled
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-white/20 backdrop-blur-md text-white'
                                    : isScrolled
                                        ? 'text-gray-700 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Tin tức
                            </Link>

                            <Link
                                to="/contact"
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${isActive('/contact')
                                    ? isScrolled
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-white/20 backdrop-blur-md text-white'
                                    : isScrolled
                                        ? 'text-gray-700 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Liên hệ
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HomeHeader;
