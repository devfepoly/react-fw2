/**
 * JWT Configuration
 * Cấu hình cho JSON Web Token
 */

module.exports = {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRE || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',

    // Cookie options
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
};
