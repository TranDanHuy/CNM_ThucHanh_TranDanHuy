/**
 * OrderItem Repository - In-Memory Storage
 */

const data = require('../data/products');

class OrderItemRepository {
    async create(orderItem) {
        data.orderItems.push(orderItem);
        return orderItem;
    }

    async createBatch(items) {
        items.forEach(item => data.orderItems.push(item));
        return items;
    }

    async getItemsByOrderId(orderId) {
        return data.orderItems.filter(item => item.orderId === orderId);
    }
}

module.exports = new OrderItemRepository();