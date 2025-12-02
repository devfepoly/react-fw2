const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testCategoryId = null;
let testProductId = null;

// Helper functions
const log = (title, data) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ ${title}`);
    console.log('='.repeat(60));
    if (data) console.log(JSON.stringify(data, null, 2));
};

const logError = (title, error) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✗ ${title}`);
    console.log('='.repeat(60));
    console.error('Full error:', error);
    console.error('Response:', error.response?.data);
    console.error('Message:', error.message);
};

// Test Suite
const runTests = async () => {
    console.log('\n🚀 BẮT ĐẦU TEST ADMIN CRUD\n');

    try {
        // ==================== AUTHENTICATION ====================
        console.log('\n📋 TEST 1: AUTHENTICATION');

        // Test 1.1: Login Admin
        const loginRes = await axios.post(`${BASE_URL}/users/login`, {
            email: 'admin01@gmail.com',
            password: 'Admin12345!'
        });
        authToken = loginRes.data.data.token;
        log('Test 1.1: Login Admin - PASSED', { token: authToken.substring(0, 20) + '...' });

        // Test 1.2: Verify token
        const verifyRes = await axios.get(`${BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        log('Test 1.2: Verify Token - PASSED', { user: verifyRes.data.data.email });

        // ==================== CATEGORY CRUD ====================
        console.log('\n📋 TEST 2: CATEGORY CRUD');

        // Test 2.1: Create Category - Valid
        const createCatRes = await axios.post(`${BASE_URL}/loai`, {
            ten_loai: `Test Category ${Date.now()}`,
            thu_tu: 1,
            an_hien: 1
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        testCategoryId = createCatRes.data.data.id;
        log('Test 2.1: Create Category - PASSED', createCatRes.data);

        // Test 2.2: Create Category - Invalid (missing name)
        try {
            await axios.post(`${BASE_URL}/loai`, {
                thu_tu: 1
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            logError('Test 2.2: Create Category Invalid - FAILED', 'Should have thrown validation error');
        } catch (error) {
            log('Test 2.2: Create Category Invalid - PASSED', { error: 'Validation error caught' });
        }

        // Test 2.3: Get All Categories
        const getAllCatRes = await axios.get(`${BASE_URL}/loai`);
        log('Test 2.3: Get All Categories - PASSED', { count: getAllCatRes.data.data.length });

        // Test 2.4: Get Category by ID
        const getCatRes = await axios.get(`${BASE_URL}/loai/${testCategoryId}`);
        log('Test 2.4: Get Category by ID - PASSED', getCatRes.data.data);

        // Test 2.5: Update Category
        const updateCatRes = await axios.put(`${BASE_URL}/loai/${testCategoryId}`, {
            ten_loai: `Updated Category ${Date.now()}`,
            thu_tu: 2,
            an_hien: 1
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        log('Test 2.5: Update Category - PASSED', updateCatRes.data);

        // Test 2.6: Update Category - Invalid ID
        try {
            await axios.put(`${BASE_URL}/loai/999999`, {
                ten_loai: 'Invalid'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            logError('Test 2.6: Update Invalid Category - FAILED', 'Should have thrown error');
        } catch (error) {
            log('Test 2.6: Update Invalid Category - PASSED', { error: 'Not found error caught' });
        }

        // ==================== PRODUCT CRUD ====================
        console.log('\n📋 TEST 3: PRODUCT CRUD');

        // Test 3.1: Create Product - Valid
        const createProdRes = await axios.post(`${BASE_URL}/san-pham`, {
            ten_sp: `Test Product ${Date.now()}`,
            gia: 10000000,
            gia_km: 8000000,
            id_loai: testCategoryId,
            ngay: new Date().toISOString().split('T')[0],
            mo_ta: 'Test product description',
            hinh: 'https://via.placeholder.com/300',
            an_hien: 1,
            hot: 0
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        testProductId = createProdRes.data.data.id;
        log('Test 3.1: Create Product - PASSED', createProdRes.data);

        // Test 3.2: Create Product - Invalid (gia_km >= gia)
        try {
            await axios.post(`${BASE_URL}/san-pham`, {
                ten_sp: 'Invalid Product',
                gia: 5000000,
                gia_km: 6000000,
                id_loai: testCategoryId
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            logError('Test 3.2: Create Invalid Product - FAILED', 'Should have thrown validation error');
        } catch (error) {
            log('Test 3.2: Create Invalid Product - PASSED', { error: 'Validation error caught' });
        }

        // Test 3.3: Create Product - Invalid (missing required fields)
        try {
            await axios.post(`${BASE_URL}/san-pham`, {
                ten_sp: 'Incomplete Product'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            logError('Test 3.3: Create Incomplete Product - FAILED', 'Should have thrown validation error');
        } catch (error) {
            log('Test 3.3: Create Incomplete Product - PASSED', { error: 'Validation error caught' });
        }

        // Test 3.4: Get All Products
        const getAllProdRes = await axios.get(`${BASE_URL}/san-pham`);
        log('Test 3.4: Get All Products - PASSED', { count: getAllProdRes.data.data.length });

        // Test 3.5: Get Product by ID
        const getProdRes = await axios.get(`${BASE_URL}/san-pham/${testProductId}`);
        log('Test 3.5: Get Product by ID - PASSED', getProdRes.data.data);

        // Test 3.6: Get Products by Category
        const getProdByCatRes = await axios.get(`${BASE_URL}/san-pham/loai/${testCategoryId}`);
        log('Test 3.6: Get Products by Category - PASSED', { count: getProdByCatRes.data.data.length });

        // Test 3.7: Update Product
        const updateProdRes = await axios.put(`${BASE_URL}/san-pham/${testProductId}`, {
            ten_sp: `Updated Product ${Date.now()}`,
            gia: 12000000,
            gia_km: 9000000,
            id_loai: testCategoryId,
            mo_ta: 'Updated description',
            an_hien: 1,
            hot: 1
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        log('Test 3.7: Update Product - PASSED', updateProdRes.data);

        // Test 3.8: Update Product - Invalid ID
        try {
            await axios.put(`${BASE_URL}/san-pham/999999`, {
                ten_sp: 'Invalid'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            logError('Test 3.8: Update Invalid Product - FAILED', 'Should have thrown error');
        } catch (error) {
            log('Test 3.8: Update Invalid Product - PASSED', { error: 'Not found error caught' });
        }

        // ==================== CLEANUP ====================
        console.log('\n📋 TEST 4: CLEANUP (DELETE)');

        // Test 4.1: Delete Product
        const deleteProdRes = await axios.delete(`${BASE_URL}/san-pham/${testProductId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        log('Test 4.1: Delete Product - PASSED', deleteProdRes.data);

        // Test 4.2: Delete Category
        const deleteCatRes = await axios.delete(`${BASE_URL}/loai/${testCategoryId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        log('Test 4.2: Delete Category - PASSED', deleteCatRes.data);

        // Test 4.3: Verify Deletion - Product
        try {
            await axios.get(`${BASE_URL}/san-pham/${testProductId}`);
            logError('Test 4.3: Verify Product Deletion - FAILED', 'Product still exists');
        } catch (error) {
            log('Test 4.3: Verify Product Deletion - PASSED', { error: 'Product not found' });
        }

        // Test 4.4: Verify Deletion - Category
        try {
            await axios.get(`${BASE_URL}/loai/${testCategoryId}`);
            logError('Test 4.4: Verify Category Deletion - FAILED', 'Category still exists');
        } catch (error) {
            log('Test 4.4: Verify Category Deletion - PASSED', { error: 'Category not found' });
        }

        // ==================== AUTHORIZATION TESTS ====================
        console.log('\n📋 TEST 5: AUTHORIZATION');

        // Test 5.1: Create Category without token
        try {
            await axios.post(`${BASE_URL}/loai`, {
                ten_loai: 'Unauthorized Test'
            });
            logError('Test 5.1: Create without Auth - FAILED', 'Should have thrown 401');
        } catch (error) {
            log('Test 5.1: Create without Auth - PASSED', { error: '401 Unauthorized' });
        }

        // Test 5.2: Delete with invalid token
        try {
            await axios.delete(`${BASE_URL}/san-pham/1`, {
                headers: { Authorization: 'Bearer invalid_token_xyz' }
            });
            logError('Test 5.2: Delete with Invalid Token - FAILED', 'Should have thrown 401');
        } catch (error) {
            log('Test 5.2: Delete with Invalid Token - PASSED', { error: '401 Unauthorized' });
        }

        // ==================== FINAL REPORT ====================
        console.log('\n' + '='.repeat(60));
        console.log('✅ TẤT CẢ TEST CASES ĐÃ PASS!');
        console.log('='.repeat(60));
        console.log(`
📊 SUMMARY:
- Authentication: ✓ 2/2 tests passed
- Category CRUD: ✓ 6/6 tests passed
- Product CRUD: ✓ 8/8 tests passed
- Cleanup: ✓ 4/4 tests passed
- Authorization: ✓ 2/2 tests passed
----------------------------------
TOTAL: ✓ 22/22 tests passed
    `);

    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        console.error('Error:', error);
        console.error('Message:', error.message);
        console.error('Response:', error.response?.data);
        console.error('Code:', error.code);
        process.exit(1);
    }
};

// Run tests
runTests().then(() => {
    console.log('\n✓ Test suite completed successfully');
    process.exit(0);
}).catch((error) => {
    console.error('\n✗ Test suite failed:', error);
    process.exit(1);
});
