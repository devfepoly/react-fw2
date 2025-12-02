import { memo, useCallback } from 'react';

// Đưa ra ngoài component để tránh tạo lại mỗi render
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const NewsCard = memo(({ news, onClick }) => {
    const handleClick = useCallback(() => {
        onClick && onClick(news.id);
    }, [onClick, news.id]);

    return (
        <div
            onClick={handleClick}
            className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
        >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-100 aspect-video">
                <img
                    src={news.hinh || 'https://via.placeholder.com/600x400'}
                    alt={news.tieu_de}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                {news.hot === 1 && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            🔥 HOT NEWS
                        </span>
                    </div>
                )}

                {/* Category Badge */}
                {news.ten_loai && (
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {news.ten_loai}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(news.ngay)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{news.luot_xem || 0} lượt xem</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.tieu_de}
                </h3>

                {/* Description */}
                <p className="text-gray-600 line-clamp-3 mb-4">
                    {news.mo_ta}
                </p>

                {/* Read More */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <button className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Đọc thêm
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                    {/* Tags */}
                    {news.tags && (
                        <div className="flex gap-1">
                            {news.tags.split(',').slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

NewsCard.displayName = 'NewsCard';

export default NewsCard;
