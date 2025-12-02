const path = require('path');
const fs = require('fs');

// Upload single image
exports.uploadSingle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        // Trả về full URL để frontend sử dụng
        const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Upload file thành công',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: fileUrl
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upload multiple images
exports.uploadMultiple = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        const filesData = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `http://localhost:3000/uploads/${file.filename}`
        }));

        res.status(200).json({
            success: true,
            message: 'Upload files thành công',
            data: filesData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete image
exports.deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).json({
                success: false,
                message: 'Tên file không được để trống'
            });
        }

        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File không tồn tại'
            });
        }

        // Delete file
        fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            message: 'Xóa file thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all uploaded images
exports.getAllImages = async (req, res) => {
    try {
        const uploadDir = path.join(__dirname, '../uploads');

        if (!fs.existsSync(uploadDir)) {
            return res.json({
                success: true,
                data: []
            });
        }

        const files = fs.readdirSync(uploadDir);

        const filesData = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            })
            .map(file => {
                const filePath = path.join(uploadDir, file);
                const stats = fs.statSync(filePath);

                return {
                    filename: file,
                    size: stats.size,
                    url: `/uploads/${file}`,
                    createdAt: stats.birthtime
                };
            })
            .sort((a, b) => b.createdAt - a.createdAt);

        res.json({
            success: true,
            data: filesData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
