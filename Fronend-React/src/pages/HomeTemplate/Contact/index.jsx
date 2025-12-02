import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-32">
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-slate-800 shadow-sm mb-8">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                        <button onClick={() => navigate('/')} className="hover:text-blue-600">Trang chủ</button>
                        <span>/</span>
                        <span className="text-blue-600 font-semibold">Liên hệ</span>
                    </nav>
                </div>
            </div>

            {/* Contact Section */}
            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Liên hệ với chúng tôi</h1>
                        <p className="text-lg text-gray-600 dark:text-slate-300">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Gửi tin nhắn</h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Họ và tên</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ và tên của bạn"
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        placeholder="0123-456-789"
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Tin nhắn</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Nội dung tin nhắn..."
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
                                    ></textarea>
                                </div>

                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            {/* Info Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Thông tin liên hệ</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Địa chỉ</h3>
                                            <p className="text-gray-600 dark:text-slate-300">123 Đường ABC, Quận XYZ, Hà Nội, Việt Nam</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Điện thoại</h3>
                                            <p className="text-gray-600 dark:text-slate-300">Hotline: 0123-456-789</p>
                                            <p className="text-gray-600 dark:text-slate-300">Support: 0987-654-321</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Email</h3>
                                            <p className="text-gray-600 dark:text-slate-300">support@shop.com</p>
                                            <p className="text-gray-600 dark:text-slate-300">info@shop.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Giờ làm việc</h3>
                                            <p className="text-gray-600 dark:text-slate-300">Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                                            <p className="text-gray-600 dark:text-slate-300">Thứ 7 - CN: 9:00 - 18:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Bản đồ</h3>
                                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
