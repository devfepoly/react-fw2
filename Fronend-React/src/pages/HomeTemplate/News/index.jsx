import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tinTucAPI, loaiTinAPI } from '../../../services/api';
import NewsCard from '../../../components/news/NewsCard';
import Loading from '../../../components/common/Loading';

const News = () => {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [newsRes, categoriesRes] = await Promise.all([
                tinTucAPI.getAll(),
                loaiTinAPI.getAll()
            ]);

            if (newsRes.data.success) {
                setNews(newsRes.data.data);
                setFilteredNews(newsRes.data.data);
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
        if (categoryId === null) {
            setFilteredNews(news);
        } else {
            setFilteredNews(news.filter(n => n.id_loai === categoryId));
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm mb-4 sm:mb-6 md:mb-8">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">Tin tức</h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300">
                                Cập nhật tin tức mới nhất
                            </p>
                        </div>
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                            <button onClick={() => navigate('/')} className="hover:text-blue-600">
                                Trang chủ
                            </button>
                            <span>/</span>
                            <span className="text-blue-600 font-semibold">Tin tức</span>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4">
                        <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 lg:sticky lg:top-24">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Danh mục tin</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => filterByCategory(null)}
                                    className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all font-medium text-sm sm:text-base ${selectedCategory === null
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    Tất cả tin tức
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => filterByCategory(category.id)}
                                        className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all font-medium text-sm sm:text-base ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {category.ten_loai}
                                    </button>
                                ))}
                            </div>

                            {/* Popular Tags */}
                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t dark:border-slate-700">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Tags phổ biến</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Công nghệ', 'Review', 'Tips', 'Khuyến mãi'].map((tag) => (
                                        <span key={tag} className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer transition">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* News Grid */}
                    <main className="flex-1">
                        {filteredNews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                                {filteredNews.map((item) => (
                                    <NewsCard
                                        key={item.id}
                                        news={item}
                                        onClick={(id) => navigate(`/news/${id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 sm:py-16 md:py-20">
                                <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Không có tin tức</h3>
                                <p className="text-sm sm:text-base text-gray-500">Chưa có tin tức nào được đăng</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default News;
