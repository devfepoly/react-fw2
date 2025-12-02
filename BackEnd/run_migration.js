const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('Connected to database');

    // Check if columns exist
    connection.query("SHOW COLUMNS FROM san_pham LIKE 'ram'", (error, results) => {
        if (error) {
            console.error('Error checking columns:', error.message);
            connection.end();
            process.exit(1);
        }

        if (results.length > 0) {
            console.log('✅ Columns already exist!');
            connection.end();
            process.exit(0);
            return;
        }

        // Add columns if they don't exist
        const sql = `
    ALTER TABLE san_pham
    ADD COLUMN ram VARCHAR(50) NULL AFTER mo_ta,
    ADD COLUMN cpu VARCHAR(100) NULL AFTER ram,
    ADD COLUMN dia_cung VARCHAR(50) NULL AFTER cpu,
    ADD COLUMN mau_sac VARCHAR(50) NULL AFTER dia_cung,
    ADD COLUMN can_nang DECIMAL(5,2) NULL AFTER mau_sac;
    `;

        connection.query(sql, (error, results) => {
            if (error) {
                console.error('Error running migration:', error.message);
                connection.end();
                process.exit(1);
            }
            console.log('✅ Migration completed successfully!');
            console.log('Added columns: ram, cpu, dia_cung, mau_sac, can_nang');
            connection.end();
            process.exit(0);
        });
    });
});
