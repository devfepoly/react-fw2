const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'your_database'
    });

    try {
        // Xóa admin cũ nếu có
        await connection.execute('DELETE FROM users WHERE email = ?', ['admin01@gmail.com']);

        // Hash password
        const password = 'Admin12345!';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo admin mới
        const [result] = await connection.execute(
            'INSERT INTO users (email, mat_khau, ho_ten, dia_chi, dien_thoai, vai_tro, khoa) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['admin01@gmail.com', hashedPassword, 'Administrator', 'Hà Nội', '0123456789', 1, 0]
        );

        console.log('✅ Admin created successfully!');
        console.log('Email: admin01@gmail.com');
        console.log('Password: Admin12345!');
        console.log('User ID:', result.insertId);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

createAdmin();
