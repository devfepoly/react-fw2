const Loai = require('../models/loai.model');

// Lấy tất cả loại
exports.getAll = async (req, res) => {
  try {
    const loai = await Loai.getAll();
    res.json({ success: true, data: loai });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy loại theo ID
exports.getById = async (req, res) => {
  try {
    const loai = await Loai.getById(req.params.id);
    if (!loai) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại' });
    }
    res.json({ success: true, data: loai });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo loại mới
exports.create = async (req, res) => {
  try {
    const id = await Loai.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo loại thành công', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật loại
exports.update = async (req, res) => {
  try {
    const affected = await Loai.update(req.params.id, req.body);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại' });
    }
    res.json({ success: true, message: 'Cập nhật loại thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa loại
exports.delete = async (req, res) => {
  try {
    const affected = await Loai.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại' });
    }
    res.json({ success: true, message: 'Xóa loại thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
