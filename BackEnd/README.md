# Backend API - E-commerce Platform

> RESTful API backend cho ứng dụng thương mại điện tử, xây dựng với Express.js và MySQL

## 🚀 Quick Start

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Chạy production server
npm start
```

## 📋 Yêu cầu hệ thống

- Node.js >= 14.x
- MySQL >= 5.7
- npm >= 6.x

## ⚙️ Cấu hình

Tạo file `.env` trong thư mục gốc:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=angular_1
DB_PORT=3306
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📁 Cấu trúc dự án

```
BackEnd/
├── config/              # Cấu hình database, email, JWT
├── constants/           # Hằng số, HTTP status codes
├── controllers/         # Business logic layer
├── helpers/             # Helper functions, response utilities
├── middleware/          # Authentication, validation
├── models/             # Database models & queries
├── routes/             # API route definitions
├── utils/              # JWT utilities
├── validators/         # Input validation schemas
├── .env                # Environment variables
├── server.js           # Entry point
└── package.json
```

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api`

### 🛍️ Sản phẩm (`/san-pham`)
- `GET /san-pham` - Lấy danh sách sản phẩm
- `GET /san-pham/:id` - Chi tiết sản phẩm
- `GET /san-pham/loai/:id_loai` - Sản phẩm theo loại
- `POST /san-pham` - Tạo sản phẩm mới
- `PUT /san-pham/:id` - Cập nhật sản phẩm
- `DELETE /san-pham/:id` - Xóa sản phẩm

### 🛒 Đơn hàng (`/don-hang`)
- `GET /don-hang` - Danh sách đơn hàng
- `GET /don-hang/:id` - Chi tiết đơn hàng
- `POST /don-hang` - Tạo đơn hàng mới
- `PUT /don-hang/:id` - Cập nhật đơn hàng
- `DELETE /don-hang/:id` - Xóa đơn hàng

### 🏷️ Loại sản phẩm (`/loai`)
- `GET /loai` - Danh sách loại sản phẩm
- `GET /loai/:id` - Chi tiết loại
- `POST /loai` - Tạo loại mới
- `PUT /loai/:id` - Cập nhật loại
- `DELETE /loai/:id` - Xóa loại

### 📝 Tin tức (`/tin-tuc`)
- `GET /tin-tuc` - Danh sách tin tức
- `GET /tin-tuc/:id` - Chi tiết tin tức
- `GET /tin-tuc/loai/:id_loai` - Tin tức theo loại
- `POST /tin-tuc` - Tạo tin tức mới
- `PUT /tin-tuc/:id` - Cập nhật tin tức
- `DELETE /tin-tuc/:id` - Xóa tin tức

### 📰 Loại tin (`/loai-tin`)
- `GET /loai-tin` - Danh sách loại tin
- `POST /loai-tin` - Tạo loại tin mới
- `PUT /loai-tin/:id` - Cập nhật loại tin
- `DELETE /loai-tin/:id` - Xóa loại tin

### 👤 Users (`/users`)
- `GET /users` - Danh sách users
- `GET /users/:id` - Thông tin user
- `POST /users` - Tạo user mới
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### 🔐 Admin (`/admin`)
- Protected routes cho admin

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Lỗi mô tả"
}
```

### HTTP Status Codes
- `200` OK - Request thành công
- `201` Created - Tạo mới thành công
- `400` Bad Request - Dữ liệu không hợp lệ
- `401` Unauthorized - Chưa xác thực
- `403` Forbidden - Không có quyền truy cập
- `404` Not Found - Không tìm thấy
- `500` Internal Server Error - Lỗi server

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Bcrypt Password Hashing
- ✅ CORS Configuration
- ✅ Input Validation (express-validator)
- ✅ Cookie Parser
- ✅ Environment Variables

## 🛠️ Scripts

```bash
# Development với nodemon (auto-reload)
npm run dev

# Production
npm start
```

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL client
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **nodemailer** - Email service
- **cookie-parser** - Cookie handling

## 🎯 Features

- ✅ RESTful API architecture
- ✅ MVC pattern
- ✅ Database connection pooling
- ✅ Error handling middleware
- ✅ Request validation
- ✅ Response helpers
- ✅ Modular structure

## 📝 Notes

- Tất cả API trả về JSON format
- CORS được cấu hình cho frontend URLs
- Auto increment lượt xem cho sản phẩm/tin tức
- Email user phải unique
- Xóa đơn hàng cascade xóa chi tiết đơn hàng

## 📧 Contact

Backend API Team

---

**Version:** 1.0.0  
**Last Updated:** November 23, 2025
