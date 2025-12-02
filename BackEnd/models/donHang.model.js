const db = require('../config/database');

class DonHang {
  // Lấy tất cả đơn hàng
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM don_hang ORDER BY thoi_diem_mua DESC');
    return rows;
  }

  // Lấy đơn hàng theo ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM don_hang WHERE id_dh = ?', [id]);
    return rows[0];
  }

  // Lấy đơn hàng theo user ID
  static async getByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM don_hang WHERE id_user = ? ORDER BY thoi_diem_mua DESC', [userId]);
    return rows;
  }

  // Lấy đơn hàng theo user ID hoặc email/sdt của user
  static async getByUserInfo(userId, email, phone) {
    const [rows] = await db.query(`
      SELECT * FROM don_hang 
      WHERE id_user = ? 
         OR (email != '' AND email = ?)
         OR (sdt != '' AND sdt = ?)
      ORDER BY thoi_diem_mua DESC
    `, [userId, email || '', phone || '']);
    return rows;
  }

  // Lấy chi tiết đơn hàng
  static async getChiTiet(id_dh) {
    const [rows] = await db.query(`
      SELECT dhct.*, sp.ten_sp, sp.hinh, sp.gia 
      FROM don_hang_chi_tiet dhct
      LEFT JOIN san_pham sp ON dhct.id_sp = sp.id
      WHERE dhct.id_dh = ?
    `, [id_dh]);
    return rows;
  }

  // Tạo đơn hàng mới
  static async create(data) {
    const { ho_ten, email, dia_chi, id_user, tong_tien, sdt, ghi_chu, trang_thai } = data;

    // Sử dụng NOW() của MySQL để tự động lấy thời gian hiện tại
    const [result] = await db.query(
      'INSERT INTO don_hang (thoi_diem_mua, ho_ten, email, dia_chi, id_user, tong_tien, sdt, ghi_chu, trang_thai) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?)',
      [ho_ten || '', email || '', dia_chi || '', id_user || null, tong_tien || 0, sdt || '', ghi_chu || '', trang_thai || 0]
    );
    return result.insertId;
  }

  // Thêm chi tiết đơn hàng
  static async addChiTiet(data) {
    const { id_dh, id_sp, so_luong } = data;
    const [result] = await db.query(
      'INSERT INTO don_hang_chi_tiet (id_dh, id_sp, so_luong) VALUES (?, ?, ?)',
      [id_dh, id_sp, so_luong]
    );
    return result.insertId;
  }

  // Cập nhật đơn hàng
  static async update(id, data) {
    const { ho_ten, email, dia_chi } = data;
    const [result] = await db.query(
      'UPDATE don_hang SET ho_ten = ?, email = ?, dia_chi = ? WHERE id_dh = ?',
      [ho_ten, email, dia_chi, id]
    );
    return result.affectedRows;
  }

  // Xóa đơn hàng
  static async delete(id) {
    // Xóa chi tiết đơn hàng trước
    await db.query('DELETE FROM don_hang_chi_tiet WHERE id_dh = ?', [id]);
    // Xóa đơn hàng
    const [result] = await db.query('DELETE FROM don_hang WHERE id_dh = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = DonHang;
