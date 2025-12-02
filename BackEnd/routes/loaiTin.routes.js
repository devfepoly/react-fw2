const express = require('express');
const router = express.Router();
const loaiTinController = require('../controllers/loaiTin.controller');

// Routes cho Loai Tin
router.get('/', loaiTinController.getAll);
router.get('/:id', loaiTinController.getById);
router.post('/', loaiTinController.create);
router.put('/:id', loaiTinController.update);
router.delete('/:id', loaiTinController.delete);

module.exports = router;
