const express = require('express');
const router = express.Router();
const loaiController = require('../controllers/loai.controller');

// Routes cho Loai
router.get('/', loaiController.getAll);
router.get('/:id', loaiController.getById);
router.post('/', loaiController.create);
router.put('/:id', loaiController.update);
router.delete('/:id', loaiController.delete);

module.exports = router;
