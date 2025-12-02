const express = require('express');
const router = express.Router();
const sanPhamController = require('../controllers/sanPham.controller');

// Routes cho San Pham
router.get('/', sanPhamController.getAll);
router.get('/:id', sanPhamController.getById);
router.get('/loai/:id_loai', sanPhamController.getByLoai);
router.post('/', sanPhamController.create);
router.put('/:id', sanPhamController.update);
router.delete('/:id', sanPhamController.delete);

module.exports = router;
