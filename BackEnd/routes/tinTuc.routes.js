const express = require('express');
const router = express.Router();
const tinTucController = require('../controllers/tinTuc.controller');

// Routes cho Tin Tuc
router.get('/', tinTucController.getAll);
router.get('/:id', tinTucController.getById);
router.get('/loai/:id_loai', tinTucController.getByLoai);
router.post('/', tinTucController.create);
router.put('/:id', tinTucController.update);
router.delete('/:id', tinTucController.delete);

module.exports = router;
