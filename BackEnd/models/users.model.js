const db = require('../config/database');

class Users {
  // Lấy tất cả users
  static async getAll() {
    const [rows] = await db.query('SELECT id, email, mat_khau, ho_ten, dia_chi, dien_thoai, vai_tro, khoa, created_at FROM users ORDER BY created_at DESC');
    return rows;
  }

  // Lấy user theo ID
  static async getById(id) {
    const [rows] = await db.query('SELECT id, email, mat_khau, ho_ten, dia_chi, dien_thoai, vai_tro, khoa, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  // Lấy user theo email
  static async getByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  // Tạo user mới
  static async create(data) {
    const { email, mat_khau, ho_ten, dia_chi, dien_thoai, vai_tro, khoa } = data;
    const [result] = await db.query(
      'INSERT INTO users (email, mat_khau, ho_ten, dia_chi, dien_thoai, vai_tro, khoa) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, mat_khau, ho_ten || '', dia_chi || '', dien_thoai || '', vai_tro !== undefined ? vai_tro : 0, khoa || 0]
    );
    return result.insertId;
  }

  // Cập nhật user
  static async update(id, data) {
    // Chỉ cập nhật các field được cung cấp
    const fields = [];
    const values = [];

    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.mat_khau !== undefined) {
      fields.push('mat_khau = ?');
      values.push(data.mat_khau);
    }
    if (data.ho_ten !== undefined) {
      fields.push('ho_ten = ?');
      values.push(data.ho_ten);
    }
    if (data.dia_chi !== undefined) {
      fields.push('dia_chi = ?');
      values.push(data.dia_chi);
    }
    if (data.dien_thoai !== undefined) {
      fields.push('dien_thoai = ?');
      values.push(data.dien_thoai);
    }
    if (data.vai_tro !== undefined) {
      fields.push('vai_tro = ?');
      values.push(data.vai_tro);
    }
    if (data.khoa !== undefined) {
      fields.push('khoa = ?');
      values.push(data.khoa);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const [result] = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  }

  // Xóa user
  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Users;
