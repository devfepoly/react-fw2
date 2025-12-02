/**
 * Validation Middleware
 * Middleware để validate dữ liệu đầu vào
 */

const { body, validationResult } = require('express-validator');

/**
 * Validate Result
 * Kiểm tra kết quả validation
 */
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array()
        });
    }
    next();
};

/**
 * Register Validation Rules
 * Quy tắc validation cho đăng ký
 */
exports.registerValidation = [
    body('email')
        .trim()
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),

    body('mat_khau')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/\d/).withMessage('Mật khẩu phải chứa ít nhất 1 số'),

    body('ho_ten')
        .trim()
        .notEmpty().withMessage('Họ tên không được để trống')
        .isLength({ min: 2 }).withMessage('Họ tên phải có ít nhất 2 ký tự'),

    body('dien_thoai')
        .optional()
        .trim()
        .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ')
];

/**
 * Login Validation Rules
 * Quy tắc validation cho đăng nhập
 */
exports.loginValidation = [
    body('email')
        .trim()
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
];

/**
 * Update Password Validation
 * Quy tắc validation cho đổi mật khẩu
 */
exports.updatePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Mật khẩu hiện tại không được để trống'),

    body('newPassword')
        .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
        .matches(/\d/).withMessage('Mật khẩu mới phải chứa ít nhất 1 số'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }
            return true;
        })
];

/**
 * Update Profile Validation
 * Quy tắc validation cho cập nhật profile
 */
exports.updateProfileValidation = [
    body('ho_ten')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Họ tên phải có ít nhất 2 ký tự'),

    body('dien_thoai')
        .optional()
        .trim()
        .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),

    body('dia_chi')
        .optional()
        .trim()
];

/**
 * Email Validation
 * Quy tắc validation cho email
 */
exports.emailValidation = [
    body('email')
        .trim()
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail()
];
