const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Route để fix database structure
router.post('/fix-database', async (req, res) => {
    try {
        console.log('Checking database structure...');

        const columnsToAdd = [
            { name: 'dia_chi', definition: 'VARCHAR(255) DEFAULT \'\'', after: 'email' },
            { name: 'id_user', definition: 'INT NULL', after: 'dia_chi' },
            { name: 'tong_tien', definition: 'DECIMAL(10,2) DEFAULT 0', after: 'id_user' },
            { name: 'sdt', definition: 'VARCHAR(20) DEFAULT \'\'', after: 'tong_tien' },
            { name: 'ghi_chu', definition: 'TEXT', after: 'sdt' },
            { name: 'trang_thai', definition: 'TINYINT DEFAULT 0 COMMENT \'0:Chờ xác nhận, 1:Đã xác nhận, 2:Đang giao, 3:Đã giao, 4:Đã hủy\'', after: 'ghi_chu' }
        ];

        const results = [];

        for (const col of columnsToAdd) {
            // Kiểm tra cột có tồn tại chưa
            const [existing] = await db.query(`SHOW COLUMNS FROM don_hang LIKE '${col.name}'`);

            if (existing.length === 0) {
                console.log(`Adding column ${col.name}...`);
                try {
                    await db.query(`ALTER TABLE don_hang ADD COLUMN ${col.name} ${col.definition} AFTER ${col.after}`);
                    results.push({ column: col.name, status: 'added' });
                    console.log(`✅ Column ${col.name} added!`);
                } catch (error) {
                    // Thử thêm mà không có AFTER clause
                    try {
                        await db.query(`ALTER TABLE don_hang ADD COLUMN ${col.name} ${col.definition}`);
                        results.push({ column: col.name, status: 'added (at end)' });
                        console.log(`✅ Column ${col.name} added at end!`);
                    } catch (err) {
                        results.push({ column: col.name, status: 'error', message: err.message });
                        console.log(`❌ Error adding ${col.name}:`, err.message);
                    }
                }
            } else {
                results.push({ column: col.name, status: 'exists' });
                console.log(`✓ Column ${col.name} already exists`);
            }
        }

        // Lấy cấu trúc bảng hiện tại
        const [structure] = await db.query('DESCRIBE don_hang');

        res.json({
            success: true,
            message: 'Database structure checked and fixed',
            results: results,
            columns: structure.map(col => ({
                field: col.Field,
                type: col.Type,
                null: col.Null
            }))
        });
    } catch (error) {
        console.error('Error fixing database:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route để xem tất cả đơn hàng (debug)
router.get('/orders/all', async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM don_hang ORDER BY thoi_diem_mua DESC LIMIT 10');
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route để gán user cho đơn hàng (để test)
router.post('/orders/assign-user', async (req, res) => {
    try {
        const { orderId, userId } = req.body;

        if (!orderId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Cần có orderId và userId'
            });
        }

        await db.query('UPDATE don_hang SET id_user = ? WHERE id_dh = ?', [userId, orderId]);

        const [updated] = await db.query('SELECT * FROM don_hang WHERE id_dh = ?', [orderId]);

        res.json({
            success: true,
            message: `Đã gán user ${userId} cho đơn hàng ${orderId}`,
            data: updated[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route để gán tất cả đơn hàng NULL cho user 1 (test)
router.get('/orders/fix-null-users', async (req, res) => {
    try {
        const [result] = await db.query('UPDATE don_hang SET id_user = 1 WHERE id_user IS NULL');

        const [orders] = await db.query('SELECT * FROM don_hang WHERE id_user = 1');

        res.json({
            success: true,
            message: `Đã gán ${result.affectedRows} đơn hàng cho user 1`,
            affected: result.affectedRows,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;