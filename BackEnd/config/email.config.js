const nodemailer = require('nodemailer');
require('dotenv').config();

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail', // Sử dụng Gmail SMTP
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS  // App Password của Gmail
    }
});

// Hàm gửi OTP qua email
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"ShopApp Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Mã OTP đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2563eb; margin: 0;">🔐 Đặt lại mật khẩu</h1>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="font-size: 16px; color: #334155; margin-bottom: 15px;">
                            Xin chào,
                        </p>
                        <p style="font-size: 16px; color: #334155; margin-bottom: 15px;">
                            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Đây là mã OTP của bạn:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; padding: 20px 40px; border-radius: 10px; display: inline-block; letter-spacing: 8px;">
                                ${otp}
                            </div>
                        </div>
                        
                        <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
                            ⏰ Mã OTP này sẽ <strong>hết hiệu lực sau 5 phút</strong>.
                        </p>
                    </div>
                    
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                        <p style="font-size: 14px; color: #991b1b; margin: 0;">
                            ⚠️ <strong>Lưu ý bảo mật:</strong> Không chia sẻ mã OTP này với bất kỳ ai. Nhân viên của chúng tôi sẽ không bao giờ yêu cầu mã OTP của bạn.
                        </p>
                    </div>
                    
                    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
                        <p style="font-size: 13px; color: #94a3b8; margin: 5px 0;">
                            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                        </p>
                        <p style="font-size: 13px; color: #94a3b8; margin: 5px 0;">
                            © 2025 ShopApp. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

module.exports = { sendOTPEmail };
