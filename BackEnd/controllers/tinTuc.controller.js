const TinTuc = require('../models/tinTuc.model');

// Lấy tất cả tin tức
exports.getAll = async (req, res) => {
  try {
    const tinTuc = await TinTuc.getAll();
    res.json({ success: true, data: tinTuc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tin tức theo ID
exports.getById = async (req, res) => {
  try {
    const tinTuc = await TinTuc.getById(req.params.id);
    if (!tinTuc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tức' });
    }
    // Tăng lượt xem
    await TinTuc.incrementView(req.params.id);
    res.json({ success: true, data: tinTuc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tin tức theo loại
exports.getByLoai = async (req, res) => {
  try {
    const tinTuc = await TinTuc.getByLoai(req.params.id_loai);
    res.json({ success: true, data: tinTuc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo tin tức mới
exports.create = async (req, res) => {
  try {
    const id = await TinTuc.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo tin tức thành công', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật tin tức
exports.update = async (req, res) => {
  try {
    const affected = await TinTuc.update(req.params.id, req.body);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tức' });
    }
    res.json({ success: true, message: 'Cập nhật tin tức thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa tin tức
exports.delete = async (req, res) => {
  try {
    const affected = await TinTuc.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tức' });
    }
    res.json({ success: true, message: 'Xóa tin tức thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
