/**
 * JWT Utilities
 * Các hàm tiện ích để tạo và xác thực JWT token
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

/**
 * Generate Access Token
 * Tạo access token cho user
 */
exports.generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
};

/**
 * Generate Refresh Token
 * Tạo refresh token cho user
 */
exports.generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        jwtConfig.refreshSecret,
        { expiresIn: jwtConfig.refreshExpiresIn }
    );
};

/**
 * Generate Token Pair
 * Tạo cả access token và refresh token
 */
exports.generateTokenPair = (userId) => {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    return {
        accessToken,
        refreshToken
    };
};

/**
 * Verify Access Token
 * Xác thực access token
 */
exports.verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        throw error;
    }
};

/**
 * Verify Refresh Token
 * Xác thực refresh token
 */
exports.verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (error) {
        throw error;
    }
};

/**
 * Decode Token (without verification)
 * Giải mã token mà không xác thực
 */
exports.decodeToken = (token) => {
    return jwt.decode(token);
};

/**
 * Get Token Expiry Time
 * Lấy thời gian hết hạn của token
 */
exports.getTokenExpiry = (token) => {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
    }
    return null;
};

/**
 * Check if Token is Expired
 * Kiểm tra token đã hết hạn chưa
 */
exports.isTokenExpired = (token) => {
    try {
        const expiry = this.getTokenExpiry(token);
        if (!expiry) return true;
        return expiry.getTime() < Date.now();
    } catch (error) {
        return true;
    }
};

/**
 * Send Token Response
 * Gửi token trong response (cả cookie và JSON)
 */
exports.sendTokenResponse = (user, statusCode, res, message = 'Thành công') => {
    // Tạo token pair
    const { accessToken, refreshToken } = this.generateTokenPair(user.id);

    // Options cho cookie
    const cookieOptions = {
        ...jwtConfig.cookieOptions,
        expires: new Date(Date.now() + jwtConfig.cookieOptions.maxAge)
    };

    // Xóa password khỏi user object
    const { mat_khau, ...userWithoutPassword } = user;

    res
        .status(statusCode)
        .cookie('token', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json({
            success: true,
            message,
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken,
                expiresIn: jwtConfig.expiresIn
            }
        });
};

/**
 * Clear Token Cookies
 * Xóa token cookies (dùng khi logout)
 */
exports.clearTokenCookies = (res) => {
    res
        .cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })
        .cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
};
