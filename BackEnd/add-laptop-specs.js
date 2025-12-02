// Script to add laptop specification columns to san_pham table
const mysql = require('mysql2/promise');
const config = require('./config/database');

async function addLaptopSpecs() {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('Connected to database');

        const alterTableSQL = `
            ALTER TABLE san_pham
            ADD COLUMN ram VARCHAR(50) NULL AFTER mo_ta,
            ADD COLUMN cpu VARCHAR(100) NULL AFTER ram,
            ADD COLUMN dia_cung VARCHAR(50) NULL AFTER cpu,
            ADD COLUMN mau_sac VARCHAR(50) NULL AFTER dia_cung,
            ADD COLUMN can_nang DECIMAL(5,2) NULL AFTER mau_sac;
        `;

        await connection.execute(alterTableSQL);
        console.log('✅ Successfully added laptop specification columns to san_pham table');
        console.log('   - ram (VARCHAR 50)');
        console.log('   - cpu (VARCHAR 100)');
        console.log('   - dia_cung (VARCHAR 50)');
        console.log('   - mau_sac (VARCHAR 50)');
        console.log('   - can_nang (DECIMAL 5,2)');

    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️  Columns already exist in the table');
        } else {
            console.error('❌ Error:', error.message);
        }
    } finally {
        if (connection) await connection.end();
    }
}

addLaptopSpecs();
