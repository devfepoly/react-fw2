const db = require('../config/database');

class Loai {
  // Lấy tất cả loại
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM loai ORDER BY thu_tu');
    return rows;
  }

  // Lấy loại theo ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM loai WHERE id = ?', [id]);
    return rows[0];
  }

  // Tạo loại mới
  static async create(data) {
    const { ten_loai, slug, thu_tu, an_hien } = data;
    const [result] = await db.query(
      'INSERT INTO loai (ten_loai, slug, thu_tu, an_hien) VALUES (?, ?, ?, ?)',
      [ten_loai, slug, thu_tu || 0, an_hien || 1]
    );
    return result.insertId;
  }

  // Cập nhật loại
  static async update(id, data) {
    const { ten_loai, slug, thu_tu, an_hien } = data;
    const [result] = await db.query(
      'UPDATE loai SET ten_loai = ?, slug = ?, thu_tu = ?, an_hien = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [ten_loai, slug, thu_tu, an_hien, id]
    );
    return result.affectedRows;
  }

  // Xóa loại
  static async delete(id) {
    const [result] = await db.query('DELETE FROM loai WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Loai;
