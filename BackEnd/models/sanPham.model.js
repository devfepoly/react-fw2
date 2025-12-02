const db = require('../config/database');

class SanPham {
  // Lấy tất cả sản phẩm
  static async getAll() {
    const [rows] = await db.query(`
      SELECT sp.id, sp.ten_sp, sp.slug, sp.gia, sp.gia_km, sp.hinh, 
             sp.ngay, sp.luot_xem, sp.mo_ta, sp.id_loai, sp.hot, sp.an_hien,
             sp.ram, sp.cpu, sp.dia_cung, sp.mau_sac, sp.can_nang,
             l.ten_loai
      FROM san_pham sp 
      LEFT JOIN loai l ON sp.id_loai = l.id 
      ORDER BY sp.ngay DESC
    `);
    return rows;
  }

  // Lấy sản phẩm có phân trang
  static async getAllPaginated(limit, offset) {
    const [rows] = await db.query(`
      SELECT sp.id, sp.ten_sp, sp.slug, sp.gia, sp.gia_km, sp.hinh, 
             sp.ngay, sp.luot_xem, sp.mo_ta, sp.id_loai, sp.hot, sp.an_hien,
             sp.ram, sp.cpu, sp.dia_cung, sp.mau_sac, sp.can_nang,
             l.ten_loai
      FROM san_pham sp 
      LEFT JOIN loai l ON sp.id_loai = l.id 
      ORDER BY sp.ngay DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    return rows;
  }

  // Đếm tổng số sản phẩm
  static async getCount() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM san_pham');
    return rows[0].total;
  }

  // Lấy sản phẩm theo ID
  static async getById(id) {
    const [rows] = await db.query(`
      SELECT sp.id, sp.ten_sp, sp.slug, sp.gia, sp.gia_km, sp.hinh, 
             sp.ngay, sp.luot_xem, sp.mo_ta, sp.id_loai, sp.hot, sp.an_hien,
             sp.ram, sp.cpu, sp.dia_cung, sp.mau_sac, sp.can_nang,
             l.ten_loai
      FROM san_pham sp 
      LEFT JOIN loai l ON sp.id_loai = l.id 
      WHERE sp.id = ?
    `, [id]);
    return rows[0];
  }

  // Lấy sản phẩm theo loại
  static async getByLoai(id_loai) {
    const [rows] = await db.query(`
      SELECT sp.id, sp.ten_sp, sp.slug, sp.gia, sp.gia_km, sp.hinh, 
             sp.ngay, sp.luot_xem, sp.mo_ta, sp.id_loai, sp.hot, sp.an_hien,
             sp.ram, sp.cpu, sp.dia_cung, sp.mau_sac, sp.can_nang,
             l.ten_loai
      FROM san_pham sp 
      LEFT JOIN loai l ON sp.id_loai = l.id 
      WHERE sp.id_loai = ?
      ORDER BY sp.ngay DESC
    `, [id_loai]);
    return rows;
  }

  // Tạo sản phẩm mới
  static async create(data) {
    const {
      ten_sp,
      gia,
      gia_km,
      hinh,
      ngay,
      mo_ta,
      id_loai,
      hot,
      an_hien
    } = data;

    // Tạo slug từ tên sản phẩm
    const slug = ten_sp
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const [result] = await db.query(
      `INSERT INTO san_pham (ten_sp, slug, gia, gia_km, hinh, ngay, luot_xem, mo_ta, id_loai, hot, an_hien) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ten_sp,
        slug,
        gia,
        gia_km || 0,
        hinh || '',
        ngay || new Date(),
        0,
        mo_ta || '',
        id_loai,
        hot || 0,
        an_hien !== undefined ? an_hien : 1
      ]
    );
    return result.insertId;
  }

  // Cập nhật sản phẩm
  static async update(id, data) {
    const { ten_sp, slug, gia, gia_km, hinh, luot_xem, mo_ta, id_loai, hot, an_hien, tinh_chat } = data;
    const [result] = await db.query(
      `UPDATE san_pham 
       SET ten_sp = ?, slug = ?, gia = ?, gia_km = ?, hinh = ?, luot_xem = ?, mo_ta = ?, id_loai = ?, hot = ?, an_hien = ?, tinh_chat = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [ten_sp, slug, gia, gia_km, hinh, luot_xem, mo_ta, id_loai, hot, an_hien, tinh_chat, id]
    );
    return result.affectedRows;
  }

  // Xóa sản phẩm
  static async delete(id) {
    const [result] = await db.query('DELETE FROM san_pham WHERE id = ?', [id]);
    return result.affectedRows;
  }

  // Tăng lượt xem
  static async incrementView(id) {
    const [result] = await db.query('UPDATE san_pham SET luot_xem = luot_xem + 1 WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = SanPham;
