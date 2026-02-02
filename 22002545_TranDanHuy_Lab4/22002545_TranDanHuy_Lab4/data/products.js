/**
 * In-Memory Data Storage
 * Thay thế AWS DynamoDB
 */

// Khởi tạo với admin mặc định
const bcrypt = require('bcrypt');
const adminPassword = bcrypt.hashSync('admin123', 10);

const data = {
    users: [{
        userId: 'user-admin-001',
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
    }],

    categories: [],

    products: [],

    productLogs: [],

    orders: [],

    orderItems: []
};

module.exports = data;