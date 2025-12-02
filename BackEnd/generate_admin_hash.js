const bcrypt = require('bcrypt');

// Script để tạo hash cho password Admin12345!
const generateHash = async () => {
    const password = 'Admin12345!';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nSQL Query:');
    console.log(`
UPDATE users 
SET mat_khau = '${hash}' 
WHERE email = 'admin01@gmail.com';
    `);
};

generateHash();
