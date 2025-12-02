-- Script khởi tạo admin user
-- Email: admin01@gmail.com
-- Password: Admin12345!
-- Mật khẩu đã được hash bằng bcrypt với saltRounds = 10

-- Xóa admin cũ nếu đã tồn tại
DELETE FROM users WHERE email = 'admin01@gmail.com';

-- Thêm admin mới
INSERT INTO users (email, mat_khau, ho_ten, dia_chi, dien_thoai, vai_tro, khoa, created_at) 
VALUES (
    'admin01@gmail.com',
    '$2b$10$eWLNEGmeO1hVMHdxiO8T4eqZJ6p1Z6dTWidOUeLnKmpk0hSOUc8A6',
    'Administrator',
    'Hà Nội',
    '0123456789',
    1,
    0,
    NOW()
);

SELECT * FROM users WHERE email = 'admin01@gmail.com';
