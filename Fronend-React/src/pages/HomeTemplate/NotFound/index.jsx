import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pt-32 flex items-center">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-gradient-to-r from-blue-600 to-purple-600 mb-4">404</h1>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Trang không tồn tại</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            Về trang chủ
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-full font-bold hover:border-blue-600 hover:text-blue-600 transition-all"
                        >
                            Quay lại
                        </button>
                    </div>

                    {/* Decorative SVG */}
                    <div className="mt-12">
                        <svg className="w-64 h-64 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
