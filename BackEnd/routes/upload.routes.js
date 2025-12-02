const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { uploadSingle, uploadMultiple } = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

// Upload single image (cần authentication)
router.post('/single', verifyToken, uploadSingle, uploadController.uploadSingle);

// Upload multiple images (cần authentication)
router.post('/multiple', verifyToken, uploadMultiple, uploadController.uploadMultiple);

// Delete image (cần authentication)
router.delete('/:filename', verifyToken, uploadController.deleteImage);

// Get all uploaded images (cần authentication)
router.get('/', verifyToken, uploadController.getAllImages);

module.exports = router;
