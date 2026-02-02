/**
 * Mock Data for Local Testing
 * Dùng khi chưa có AWS setup
 */

module.exports = {
    users: [{
        userId: "admin-001",
        username: "admin",
        password: "$2b$10$YourHashedPasswordHere", // admin123
        role: "admin",
        createdAt: new Date().toISOString()
    }],

    categories: [{
            categoryId: "cat-001",
            name: "Điện thoại",
            description: "Smartphone và thiết bị di động"
        },
        {
            categoryId: "cat-002",
            name: "Laptop",
            description: "Máy tính xách tay"
        },
        {
            categoryId: "cat-003",
            name: "Phụ kiện",
            description: "Phụ kiện công nghệ"
        }
    ],

    products: [{
            id: "prod-001",
            name: "iPhone 15 Pro",
            price: 29990000,
            quantity: 10,
            categoryId: "cat-001",
            url_image: null,
            isDeleted: false,
            createdAt: new Date().toISOString()
        },
        {
            id: "prod-002",
            name: "MacBook Air M2",
            price: 28990000,
            quantity: 5,
            categoryId: "cat-002",
            url_image: null,
            isDeleted: false,
            createdAt: new Date().toISOString()
        },
        {
            id: "prod-003",
            name: "AirPods Pro",
            price: 6990000,
            quantity: 2,
            categoryId: "cat-003",
            url_image: null,
            isDeleted: false,
            createdAt: new Date().toISOString()
        }
    ],

    orders: [],
    orderItems: [],
    productLogs: []
};