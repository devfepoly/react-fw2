const db = require('../config/database');

class TinTuc {
  // Lấy tất cả tin tức
  static async getAll() {
    const [rows] = await db.query(`
      SELECT tt.*, lt.ten_loai as ten_loai 
      FROM tin_tuc tt 
      LEFT JOIN loai_tin lt ON tt.id_loai = lt.id 
      ORDER BY tt.ngay DESC
    `);
    return rows;
  }

  // Lấy tin tức theo ID
  static async getById(id) {
    const [rows] = await db.query(`
      SELECT tt.*, lt.ten_loai as ten_loai 
      FROM tin_tuc tt 
      LEFT JOIN loai_tin lt ON tt.id_loai = lt.id 
      WHERE tt.id = ?
    `, [id]);
    return rows[0];
  }

  // Lấy tin tức theo loại
  static async getByLoai(id_loai) {
    const [rows] = await db.query(`
      SELECT tt.*, lt.ten_loai as ten_loai 
      FROM tin_tuc tt 
      LEFT JOIN loai_tin lt ON tt.id_loai = lt.id 
      WHERE tt.id_loai = ?
      ORDER BY tt.ngay DESC
    `, [id_loai]);
    return rows;
  }

  // Tạo tin tức mới
  static async create(data) {
    const { tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai, hot, luot_xem, an_hien, tags } = data;
    const [result] = await db.query(
      `INSERT INTO tin_tuc (tieu_de, slug, mo_ta, hinh, ngay, noi_dung, id_loai, hot, luot_xem, an_hien, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tieu_de, slug, mo_ta || '', hinh || '', ngay || new Date(), noi_dung || '', id_loai, hot || 0, luot_xem || 0, an_hien || 1, tags || '']
    );
    return result.insertId;
  }

  // Cập nhật tin tức
  static async update(id, data) {
    const { tieu_de, slug, mo_ta, hinh, noi_dung, id_loai, hot, luot_xem, an_hien, tags } = data;
    const [result] = await db.query(
      `UPDATE tin_tuc 
       SET tieu_de = ?, slug = ?, mo_ta = ?, hinh = ?, noi_dung = ?, id_loai = ?, hot = ?, luot_xem = ?, an_hien = ?, tags = ?
       WHERE id = ?`,
      [tieu_de, slug, mo_ta, hinh, noi_dung, id_loai, hot, luot_xem, an_hien, tags, id]
    );
    return result.affectedRows;
  }

  // Xóa tin tức
  static async delete(id) {
    const [result] = await db.query('DELETE FROM tin_tuc WHERE id = ?', [id]);
    return result.affectedRows;
  }

  // Tăng lượt xem
  static async incrementView(id) {
    const [result] = await db.query('UPDATE tin_tuc SET luot_xem = luot_xem + 1 WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = TinTuc;
