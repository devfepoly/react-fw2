const LoaiTin = require('../models/loaiTin.model');

// Lấy tất cả loại tin
exports.getAll = async (req, res) => {
  try {
    const loaiTin = await LoaiTin.getAll();
    res.json({ success: true, data: loaiTin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy loại tin theo ID
exports.getById = async (req, res) => {
  try {
    const loaiTin = await LoaiTin.getById(req.params.id);
    if (!loaiTin) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại tin' });
    }
    res.json({ success: true, data: loaiTin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo loại tin mới
exports.create = async (req, res) => {
  try {
    const id = await LoaiTin.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo loại tin thành công', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật loại tin
exports.update = async (req, res) => {
  try {
    const affected = await LoaiTin.update(req.params.id, req.body);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại tin' });
    }
    res.json({ success: true, message: 'Cập nhật loại tin thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa loại tin
exports.delete = async (req, res) => {
  try {
    const affected = await LoaiTin.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại tin' });
    }
    res.json({ success: true, message: 'Xóa loại tin thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
