const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/donHang.controller');

// Routes cho Don Hang
router.get('/', donHangController.getAll);
router.get('/user/:userId', donHangController.getByUserId); // Đặt trước /:id để tránh conflict
router.get('/:id', donHangController.getById);
router.post('/', donHangController.create);
router.put('/:id', donHangController.update);
router.delete('/:id', donHangController.delete);

module.exports = router;
