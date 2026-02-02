/**
 * Product Repository - In-Memory Storage
 */

const data = require('../data/products');

class ProductRepository {
    async create(product) {
        data.products.push(product);
        return product;
    }

    async findById(id) {
        return data.products.find(p => p.id === id) || null;
    }

    /**
     * Tìm kiếm và lọc sản phẩm
     * @param {Object} filters - { keyword, categoryId, minPrice, maxPrice }
     * @returns {Array} Danh sách sản phẩm (không bị soft delete)
     */
    async search(filters = {}) {
        let results = data.products.filter(p => !p.isDeleted);

        // Tìm theo tên
        if (filters.keyword) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(filters.keyword.toLowerCase())
            );
        }

        // Lọc theo category
        if (filters.categoryId) {
            results = results.filter(p => p.categoryId === filters.categoryId);
        }

        // Lọc theo giá
        if (filters.minPrice) {
            results = results.filter(p => p.price >= Number(filters.minPrice));
        }

        if (filters.maxPrice) {
            results = results.filter(p => p.price <= Number(filters.maxPrice));
        }

        return results;
    }

    /**
     * Lấy tất cả sản phẩm (chỉ hiển thị chưa bị xóa)
     */
    async getAll(includeDeleted = false) {
        if (includeDeleted) {
            return data.products;
        }
        return data.products.filter(p => !p.isDeleted);
    }

    /**
     * Cập nhật sản phẩm
     */
    async update(id, updateData) {
        const index = data.products.findIndex(p => p.id === id);
        if (index === -1) return null;

        data.products[index] = {
            ...data.products[index],
            ...updateData
        };
        return data.products[index];
    }

    /**
     * Soft Delete
     */
    async softDelete(id) {
        return await this.update(id, { isDeleted: true });
    }

    /**
     * Hard Delete (xóa vĩnh viễn - nếu cần)
     */
    async hardDelete(id) {
        const index = data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            data.products.splice(index, 1);
        }
    }
}

module.exports = new ProductRepository();