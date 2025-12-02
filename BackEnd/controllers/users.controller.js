const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const { sendOTPEmail } = require('../config/email.config');

// Lưu trữ OTP tạm thời (trong production nên dùng Redis)
const otpStorage = new Map(); // { email: { otp, expiresAt, resetToken } }

/**
 * @route   POST /api/users/register
 * @desc    Đăng ký user mới
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { email, mat_khau, ho_ten, dien_thoai, dia_chi } = req.body;

    // Validate input
    if (!email || !mat_khau || !ho_ten) {
      return res.status(400).json({
        success: false,
        message: 'Email, mật khẩu và họ tên là bắt buộc'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Validate password strength (ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(mat_khau)) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await Users.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);

    // Tạo user mới
    const userId = await Users.create({
      email,
      mat_khau: hashedPassword,
      ho_ten,
      dien_thoai: dien_thoai || null,
      dia_chi: dia_chi || null,
      vai_tro: 0 // Mặc định là user (0: user, 1: admin)
    });

    // Lấy thông tin user vừa tạo
    const newUser = await Users.getById(userId);

    // Gửi token response
    jwtUtils.sendTokenResponse(newUser, 201, res, 'Đăng ký thành công');
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

/**
 * @route   POST /api/users/login
 * @desc    Đăng nhập
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Tìm user theo email
    const user = await Users.getByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra tài khoản có bị khóa
    if (user.khoa === 1) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa. Vui lòng liên hệ admin'
      });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.mat_khau);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Gửi token response
    jwtUtils.sendTokenResponse(user, 200, res, 'Đăng nhập thành công');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

/**
 * @route   POST /api/users/logout
 * @desc    Đăng xuất
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    // Xóa token cookies
    jwtUtils.clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   POST /api/users/refresh-token
 * @desc    Làm mới access token bằng refresh token
 * @access  Public
 */
exports.refreshToken = async (req, res) => {
  try {
    // User đã được verify ở middleware
    const user = req.user;

    // Tạo access token mới
    const accessToken = jwtUtils.generateAccessToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Làm mới token thành công',
      data: {
        accessToken,
        expiresIn: require('../config/jwt.config').expiresIn
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   GET /api/users/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    // req.user đã được set từ middleware auth
    const user = await Users.getById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    const { mat_khau, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   PUT /api/users/update-profile
 * @desc    Cập nhật thông tin profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ho_ten, dien_thoai, dia_chi } = req.body;

    const updateData = {};
    if (ho_ten) updateData.ho_ten = ho_ten;
    if (dien_thoai) updateData.dien_thoai = dien_thoai;
    if (dia_chi) updateData.dia_chi = dia_chi;

    const affected = await Users.update(userId, updateData);

    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Lấy thông tin user đã cập nhật
    const updatedUser = await Users.getById(userId);
    const { mat_khau, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   PUT /api/users/update-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Lấy thông tin user
    const user = await Users.getById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.mat_khau);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Hash mật khẩu mới
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu
    await Users.update(userId, { mat_khau: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/users
 * @desc    Lấy tất cả users (Admin only)
 * @access  Private/Admin
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Users.getAll();

    // Xóa password khỏi tất cả users
    const usersWithoutPassword = users.map(user => {
      const { mat_khau, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      count: usersWithoutPassword.length,
      data: usersWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Lấy user theo ID (Admin only)
 * @access  Private/Admin
 */
exports.getById = async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    const { mat_khau, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   POST /api/users
 * @desc    Tạo user mới (Admin only)
 * @access  Private/Admin
 */
exports.create = async (req, res) => {
  try {
    const { email, mat_khau, ho_ten, dien_thoai, dia_chi, vai_tro } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await Users.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    // Hash mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);

    const userId = await Users.create({
      email,
      mat_khau: hashedPassword,
      ho_ten,
      dien_thoai: dien_thoai || null,
      dia_chi: dia_chi || null,
      vai_tro: vai_tro !== undefined ? vai_tro : 0 // 0: user, 1: admin
    });

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: { id: userId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Cập nhật user (Admin only)
 * @access  Private/Admin
 */
exports.update = async (req, res) => {
  try {
    const { mat_khau, ...updateData } = req.body;

    // Nếu cập nhật mật khẩu, cần hash
    if (mat_khau) {
      const saltRounds = 10;
      updateData.mat_khau = await bcrypt.hash(mat_khau, saltRounds);
    }

    const affected = await Users.update(req.params.id, updateData);

    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa user (Admin only)
 * @access  Private/Admin
 */
exports.delete = async (req, res) => {
  try {
    // Không cho phép xóa chính mình
    if (req.user && req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản của chính mình'
      });
    }

    const affected = await Users.delete(req.params.id);

    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa user thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

// ==================== PASSWORD RESET ROUTES ====================

/**
 * @route   POST /api/users/forgot-password
 * @desc    Gửi mã OTP để reset password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email'
      });
    }

    // Kiểm tra email có tồn tại không
    const user = await Users.getByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      });
    }

    // Tạo mã OTP ngẫu nhiên 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP hết hạn sau 5 phút

    // Lưu OTP vào bộ nhớ tạm
    otpStorage.set(email, {
      otp,
      expiresAt,
      verified: false
    });

    // Gửi OTP qua email
    try {
      await sendOTPEmail(email, otp);

      console.log(`\n========== OTP RESET PASSWORD ==========`);
      console.log(`Email: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log(`Expires in: 5 minutes`);
      console.log(`========================================\n`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      otpStorage.delete(email); // Xóa OTP nếu gửi email thất bại

      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email. Vui lòng kiểm tra cấu hình email hoặc thử lại sau.'
      });
    }

    // Auto cleanup sau 5 phút
    setTimeout(() => {
      if (otpStorage.has(email)) {
        otpStorage.delete(email);
        console.log(`OTP for ${email} has expired and been removed`);
      }
    }, 5 * 60 * 1000);

    res.status(200).json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam).'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   POST /api/users/verify-otp
 * @desc    Xác thực mã OTP
 * @access  Public
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    // Kiểm tra OTP có tồn tại không
    const otpData = otpStorage.get(email);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP không tồn tại hoặc đã hết hạn'
      });
    }

    // Kiểm tra OTP đã hết hạn chưa
    if (Date.now() > otpData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Mã OTP đã hết hạn'
      });
    }

    // Kiểm tra OTP có đúng không
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP không đúng'
      });
    }

    // Tạo reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');

    // Cập nhật trạng thái đã verify và lưu reset token
    otpStorage.set(email, {
      ...otpData,
      verified: true,
      resetToken,
      resetTokenExpiresAt: Date.now() + 15 * 60 * 1000 // Reset token hết hạn sau 15 phút
    });

    console.log(`\n========== OTP VERIFIED ==========`);
    console.log(`Email: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`==================================\n`);

    res.status(200).json({
      success: true,
      message: 'Xác thực OTP thành công',
      data: {
        resetToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * @route   POST /api/users/reset-password
 * @desc    Đặt lại mật khẩu mới
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Tìm email có reset token này
    let email = null;
    for (const [key, value] of otpStorage.entries()) {
      if (value.resetToken === resetToken) {
        email = key;
        break;
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    const otpData = otpStorage.get(email);

    // Kiểm tra đã verify OTP chưa
    if (!otpData.verified) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng xác thực OTP trước'
      });
    }

    // Kiểm tra reset token đã hết hạn chưa
    if (Date.now() > otpData.resetTokenExpiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }

    // Lấy thông tin user
    const user = await Users.getByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    // Hash mật khẩu mới
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu
    await Users.update(user.id, { mat_khau: hashedPassword });

    // Xóa OTP data
    otpStorage.delete(email);

    console.log(`\n========== PASSWORD RESET SUCCESS ==========`);
    console.log(`Email: ${email}`);
    console.log(`User ID: ${user.id}`);
    console.log(`===========================================\n`);

    res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};
