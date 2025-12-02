import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanPhamAPI, loaiAPI } from '../../../services/api';
import ProductCard from '../../../components/product/ProductCard';
import Loading from '../../../components/common/Loading';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                sanPhamAPI.getAll(),
                loaiAPI.getAll()
            ]);
            if (productsRes.data.success) {
                const allProducts = productsRes.data.data;
                setProducts(allProducts.slice(0, 8));
                setFeaturedProducts(allProducts.filter(p => p.hot === 1).slice(0, 4));
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

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 text-white py-8 sm:py-12 md:py-16 mt-16 sm:mt-20 md:mt-24">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
                <div className="container mx-auto px-3 sm:px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animate-fade-in">
                            Chào mừng đến ShopOnline
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-blue-100">
                            Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-white text-blue-600 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Mua sắm ngay
                            </button>
                            <button
                                onClick={() => navigate('/news')}
                                className="bg-transparent border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                            >
                                Xem tin tức
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-gray-50 dark:fill-slate-900" />
                    </svg>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-8 sm:py-12 bg-gray-50 dark:bg-slate-900">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3">Danh mục sản phẩm</h2>
                        <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base">Chọn danh mục bạn quan tâm</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => navigate(`/category/${category.id}`)}
                                className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-transparent dark:border-slate-700"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                    {category.ten_loai}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-8 sm:py-12">
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3 flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl">🔥</span>
                                    Sản phẩm HOT
                                </h2>
                                <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base">Những sản phẩm được yêu thích nhất</p>
                            </div>
                            <button
                                onClick={() => navigate('/products')}
                                className="text-blue-600 font-semibold flex items-center gap-1 sm:gap-2 hover:gap-2 sm:hover:gap-3 transition-all text-sm sm:text-base"
                            >
                                Xem tất cả
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={(id) => navigate(`/product/${id}`)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Products */}
            <section className="py-8 sm:py-12 bg-gray-50 dark:bg-slate-900">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3">Sản phẩm mới nhất</h2>
                            <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base">Cập nhật liên tục mỗi ngày</p>
                        </div>
                        <button
                            onClick={() => navigate('/products')}
                            className="text-blue-600 font-semibold flex items-center gap-1 sm:gap-2 hover:gap-2 sm:hover:gap-3 transition-all text-sm sm:text-base"
                        >
                            Xem tất cả
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={(id) => navigate(`/product/${id}`)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-8 sm:py-12">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        <div className="text-center p-3 sm:p-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-sm sm:text-base mb-1 dark:text-slate-100">Chất lượng đảm bảo</h3>
                            <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm">Sản phẩm chính hãng 100%</p>
                        </div>

                        <div className="text-center p-3 sm:p-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-sm sm:text-base mb-1 dark:text-slate-100">Giá cả hợp lý</h3>
                            <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm">Cam kết giá tốt nhất</p>
                        </div>

                        <div className="text-center p-3 sm:p-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-sm sm:text-base mb-1 dark:text-slate-100">Giao hàng nhanh</h3>
                            <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm">Miễn phí vận chuyển</p>
                        </div>

                        <div className="text-center p-3 sm:p-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-sm sm:text-base mb-1 dark:text-slate-100">Hỗ trợ 24/7</h3>
                            <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm">Tư vấn và hỗ trợ</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
