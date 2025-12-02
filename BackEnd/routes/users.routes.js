const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken, verifyRefreshToken, authorizeRoles } = require('../middleware/auth.middleware');
const {
    registerValidation,
    loginValidation,
    updatePasswordValidation,
    updateProfileValidation,
    validate
} = require('../middleware/validation.middleware');

// ==================== PUBLIC ROUTES ====================
// Authentication routes
router.post('/register', registerValidation, validate, usersController.register);
router.post('/login', loginValidation, validate, usersController.login);
router.post('/refresh-token', verifyRefreshToken, usersController.refreshToken);

// Password reset routes
router.post('/forgot-password', usersController.forgotPassword);
router.post('/verify-otp', usersController.verifyOTP);
router.post('/reset-password', usersController.resetPassword);

// ==================== PROTECTED ROUTES ====================
// User profile routes (requires authentication)
router.get('/me', verifyToken, usersController.getMe);
router.put('/update-profile', verifyToken, updateProfileValidation, validate, usersController.updateProfile);
router.put('/update-password', verifyToken, updatePasswordValidation, validate, usersController.updatePassword);
router.post('/logout', verifyToken, usersController.logout);

// ==================== ADMIN ROUTES ====================
// Admin user management (requires authentication + admin role)
router.get('/', verifyToken, authorizeRoles('admin'), usersController.getAll);
router.get('/:id', verifyToken, authorizeRoles('admin'), usersController.getById);
router.post('/', verifyToken, authorizeRoles('admin'), usersController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), usersController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), usersController.delete);

module.exports = router;

