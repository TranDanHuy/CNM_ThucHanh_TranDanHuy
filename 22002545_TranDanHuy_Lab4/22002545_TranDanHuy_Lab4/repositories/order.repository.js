/**
 * Order Repository - In-Memory Storage
 */

const data = require('../data/products');

class OrderRepository {
    async create(order) {
        data.orders.push(order);
        return order;
    }

    async findById(orderId) {
        return data.orders.find(o => o.orderId === orderId) || null;
    }

    async getAll() {
        return data.orders;
    }

    async updateStatus(orderId, status) {
        const index = data.orders.findIndex(o => o.orderId === orderId);
        if (index === -1) return null;

        data.orders[index].status = status;
        return data.orders[index];
    }

    async getOrdersByCustomer(customerEmail) {
        return data.orders.filter(o => o.customerEmail === customerEmail);
    }
}

module.exports = new OrderRepository();