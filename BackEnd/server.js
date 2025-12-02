const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory with proper headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Serve static files from images directory (for legacy support)
app.use('/images', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../images')));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running',
    version: '1.0.0',
    status: 'OK'
  });
});

// Debug endpoint to check uploads folder
app.get('/debug/uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');

  if (!fs.existsSync(uploadsPath)) {
    return res.json({ exists: false, message: 'Uploads folder does not exist' });
  }

  const files = fs.readdirSync(uploadsPath);
  res.json({
    exists: true,
    path: uploadsPath,
    files: files,
    count: files.length
  });
});

// Import routes
const loaiRoutes = require('./routes/loai.routes');
const loaiTinRoutes = require('./routes/loaiTin.routes');
const sanPhamRoutes = require('./routes/sanPham.routes');
const tinTucRoutes = require('./routes/tinTuc.routes');
const donHangRoutes = require('./routes/donHang.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');

// Use routes
app.use('/api/loai', loaiRoutes);
app.use('/api/loai-tin', loaiTinRoutes);
app.use('/api/san-pham', sanPhamRoutes);
app.use('/api/tin-tuc', tinTucRoutes);
app.use('/api/don-hang', donHangRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
