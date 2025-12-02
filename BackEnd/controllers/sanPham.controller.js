const SanPham = require('../models/sanPham.model');

// Lấy tất cả sản phẩm (có hỗ trợ pagination)
exports.getAll = async (req, res) => {
  try {
    // Lấy query params cho pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0; // 0 = không phân trang
    const offset = (page - 1) * limit;

    if (limit > 0) {
      // Có phân trang
      const [sanPham, totalCount] = await Promise.all([
        SanPham.getAllPaginated(limit, offset),
        SanPham.getCount()
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: sanPham,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } else {
      // Không phân trang - trả về tất cả
      const sanPham = await SanPham.getAll();
      res.json({ success: true, data: sanPham });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm theo ID
exports.getById = async (req, res) => {
  try {
    const sanPham = await SanPham.getById(req.params.id);
    if (!sanPham) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    // Tăng lượt xem
    await SanPham.incrementView(req.params.id);
    res.json({ success: true, data: sanPham });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm theo loại
exports.getByLoai = async (req, res) => {
  try {
    const sanPham = await SanPham.getByLoai(req.params.id_loai);
    res.json({ success: true, data: sanPham });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo sản phẩm mới
exports.create = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    const id = await SanPham.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công', id });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm
exports.update = async (req, res) => {
  try {
    const affected = await SanPham.update(req.params.id, req.body);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm
exports.delete = async (req, res) => {
  try {
    const affected = await SanPham.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
