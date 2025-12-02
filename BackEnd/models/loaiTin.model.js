const db = require('../config/database');

class LoaiTin {
  // Lấy tất cả loại tin
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM loai_tin ORDER BY thu_tu');
    return rows;
  }

  // Lấy loại tin theo ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM loai_tin WHERE id = ?', [id]);
    return rows[0];
  }

  // Tạo loại tin mới
  static async create(data) {
    const { ten_loai, slug, thu_tu, an_hien } = data;
    const [result] = await db.query(
      'INSERT INTO loai_tin (ten_loai, slug, thu_tu, an_hien) VALUES (?, ?, ?, ?)',
      [ten_loai, slug, thu_tu || 0, an_hien || 1]
    );
    return result.insertId;
  }

  // Cập nhật loại tin
  static async update(id, data) {
    const { ten_loai, slug, thu_tu, an_hien } = data;
    const [result] = await db.query(
      'UPDATE loai_tin SET ten_loai = ?, slug = ?, thu_tu = ?, an_hien = ? WHERE id = ?',
      [ten_loai, slug, thu_tu, an_hien, id]
    );
    return result.affectedRows;
  }

  // Xóa loại tin
  static async delete(id) {
    const [result] = await db.query('DELETE FROM loai_tin WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = LoaiTin;
