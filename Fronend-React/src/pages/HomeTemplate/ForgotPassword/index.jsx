import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI } from '../../../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');

    // Step 1: Nhập email và gửi OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Vui lòng nhập email');
            return;
        }

        setLoading(true);

        try {
            //eslint-disable-next-line
            const response = await usersAPI.forgotPassword(email);
            setSuccess('OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Xác thực OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        if (otp.length !== 6) {
            setError('Mã OTP phải có 6 chữ số');
            return;
        }

        setLoading(true);

        try {
            const response = await usersAPI.verifyOTP(email, otp);
            setResetToken(response.data.data.resetToken);
            setSuccess('Xác thực thành công! Vui lòng nhập mật khẩu mới.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            await usersAPI.resetPassword(resetToken, newPassword);
            setSuccess('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await usersAPI.forgotPassword(email);
            setSuccess('OTP mới đã được gửi đến email của bạn.');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fadeIn border border-gray-100 dark:border-slate-700">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                        <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100">
                        Quên mật khẩu
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                        {step === 1 && 'Nhập email để nhận mã OTP'}
                        {step === 2 && 'Nhập mã OTP từ email'}
                        {step === 3 && 'Đặt mật khẩu mới'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-300 dark:bg-slate-600 text-gray-600 dark:text-slate-300'} transition-all`}>
                            {step > 1 ? '✓' : '1'}
                        </div>
                        <span className="text-xs mt-1 text-gray-600 dark:text-slate-400 font-medium">Email</span>
                    </div>
                    <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'} transition-all`}></div>
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-300 dark:bg-slate-600 text-gray-600 dark:text-slate-300'} transition-all`}>
                            {step > 2 ? '✓' : '2'}
                        </div>
                        <span className="text-xs mt-1 text-gray-600 dark:text-slate-400 font-medium">OTP</span>
                    </div>
                    <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'} transition-all`}></div>
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-300 dark:bg-slate-600 text-gray-600 dark:text-slate-300'} transition-all`}>
                            3
                        </div>
                        <span className="text-xs mt-1 text-gray-600 dark:text-slate-400 font-medium">Mật khẩu</span>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-shake">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                        <div className="flex">
                            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {/* Step 1: Email Form */}
                {step === 1 && (
                    <form className="mt-6 space-y-5" onSubmit={handleSendOTP}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                                Email đăng ký
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Gửi mã OTP'
                            )}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                )}

                {/* Step 2: OTP Form */}
                {step === 2 && (
                    <form className="mt-6 space-y-5" onSubmit={handleVerifyOTP}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                                Mã OTP (6 chữ số)
                            </label>
                            <div className="relative">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    maxLength="6"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="appearance-none block w-full px-3 py-4 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-3xl tracking-[1em] font-bold shadow-sm hover:shadow-md"
                                    placeholder="000000"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Xác thực OTP'
                            )}
                        </button>

                        <div className="text-center space-y-2">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                            >
                                Gửi lại mã OTP
                            </button>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-500 dark:hover:text-slate-300 transition-colors"
                                >
                                    ← Thay đổi email
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Step 3: New Password Form */}
                {step === 3 && (
                    <form className="mt-6 space-y-5" onSubmit={handleResetPassword}>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="Ít nhất 6 ký tự"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="Nhập lại mật khẩu"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Đặt lại mật khẩu'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
