/**
 * User Repository - In-Memory Storage
 */

const data = require('../data/products');

class UserRepository {
    async create(user) {
        data.users.push(user);
        return user;
    }

    async findByUsername(username) {
        return data.users.find(u => u.username === username) || null;
    }

    async findById(userId) {
        return data.users.find(u => u.userId === userId) || null;
    }

    async getAll() {
        return data.users;
    }
}

module.exports = new UserRepository();