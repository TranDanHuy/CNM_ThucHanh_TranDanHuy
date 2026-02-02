/**
 * Product Log Repository - In-Memory Storage
 */

const data = require('../data/products');

class ProductLogRepository {
    async create(log) {
        data.productLogs.push(log);
        return log;
    }

    async getLogsByProductId(productId) {
        return data.productLogs.filter(log => log.productId === productId);
    }

    async getAll() {
        return data.productLogs;
    }
}

module.exports = new ProductLogRepository();