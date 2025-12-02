/**
 * Authentication Middleware
 * Middleware để xác thực JWT token
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');
const Users = require('../models/users.model');

/**
 * Verify JWT Token
 * Middleware để xác thực token từ header hoặc cookie
 */
exports.verifyToken = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization hoặc cookie
        let token = null;

        // Kiểm tra Authorization header (Bearer token)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Kiểm tra từ cookie
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token. Vui lòng đăng nhập!'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Lấy thông tin user từ database
        const user = await Users.getById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ. User không tồn tại!'
            });
        }

        // Gán user vào request để sử dụng ở các middleware/controller tiếp theo
        const { mat_khau, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ!'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn. Vui lòng đăng nhập lại!'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực: ' + error.message
        });
    }
};

/**
 * Verify Refresh Token
 * Middleware để xác thực refresh token
 */
exports.verifyRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy refresh token!'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

        // Lấy thông tin user
        const user = await Users.getById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token không hợp lệ!'
            });
        }

        const { mat_khau, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token không hợp lệ!'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token đã hết hạn. Vui lòng đăng nhập lại!'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực refresh token: ' + error.message
        });
    }
};

/**
 * Authorize Roles
 * Middleware để phân quyền theo vai trò
 * Roles: 0 = user, 1 = admin
 */
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || req.user.vai_tro === undefined) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập!'
            });
        }

        // Convert string roles to numbers if needed ('admin' -> 1, 'user' -> 0)
        const numericRoles = roles.map(role => {
            if (role === 'admin') return 1;
            if (role === 'user') return 0;
            return role;
        });

        if (!numericRoles.includes(req.user.vai_tro)) {
            const roleName = req.user.vai_tro === 1 ? 'admin' : 'user';
            return res.status(403).json({
                success: false,
                message: `Vai trò ${roleName} không có quyền truy cập tài nguyên này!`
            });
        }

        next();
    };
};

/**
 * Optional Auth
 * Middleware xác thực tùy chọn (không bắt buộc)
 * Hữu ích cho các route có thể truy cập cả khi đã đăng nhập và chưa đăng nhập
 */
exports.optionalAuth = async (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, jwtConfig.secret);
                const user = await Users.getById(decoded.id);

                if (user) {
                    const { mat_khau, ...userWithoutPassword } = user;
                    req.user = userWithoutPassword;
                }
            } catch (err) {
                // Token không hợp lệ hoặc hết hạn, không làm gì cả
                // Chỉ đơn giản là không gán user vào request
            }
        }

        next();
    } catch (error) {
        next();
    }
};
