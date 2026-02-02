/**
 * Category Repository - In-Memory Storage
 */

const data = require('../data/products');

class CategoryRepository {
    async create(category) {
        data.categories.push(category);
        return category;
    }

    async findById(categoryId) {
        return data.categories.find(c => c.categoryId === categoryId) || null;
    }

    async getAll() {
        return data.categories;
    }

    async update(categoryId, updateData) {
        const index = data.categories.findIndex(c => c.categoryId === categoryId);
        if (index === -1) return null;

        data.categories[index] = {
            ...data.categories[index],
            ...updateData
        };
        return data.categories[index];
    }

    async delete(categoryId) {
        const index = data.categories.findIndex(c => c.categoryId === categoryId);
        if (index !== -1) {
            data.categories.splice(index, 1);
        }
    }
}

module.exports = new CategoryRepository();