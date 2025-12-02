const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-32">
            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">Về chúng tôi</h1>

                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">ShopOnline</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            ShopOnline là nền tảng mua sắm trực tuyến hàng đầu, cam kết mang đến cho khách hàng những sản phẩm chất lượng cao với giá cả hợp lý nhất.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Với đội ngũ chuyên nghiệp và tận tâm, chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Sứ mệnh</h3>
                            <p className="text-gray-600">Mang đến trải nghiệm mua sắm tốt nhất</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">👁️</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Tầm nhìn</h3>
                            <p className="text-gray-600">Trở thành nền tảng số 1 Việt Nam</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">💎</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Giá trị</h3>
                            <p className="text-gray-600">Uy tín - Chất lượng - Tận tâm</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
