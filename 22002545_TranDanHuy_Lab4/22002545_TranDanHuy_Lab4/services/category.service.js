/**
 * Category Service
 * Business logic cho quản lý danh mục
 */

const { randomUUID } = require("crypto");
const categoryRepository = require("../repositories/category.repository");
const productRepository = require("../repositories/product.repository");

class CategoryService {
  async create(name, description) {
    const category = {
      categoryId: randomUUID(),
      name,
      description: description || "",
    };

    return await categoryRepository.create(category);
  }

  async getAll() {
    return await categoryRepository.getAll();
  }

  async getById(categoryId) {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }
    return category;
  }

  async update(categoryId, name, description) {
    await this.getById(categoryId); // Kiểm tra tồn tại
    return await categoryRepository.update(categoryId, { name, description });
  }

  /**
   * Xóa category
   * Business rule: Không xóa sản phẩm khi xóa category
   */
  async delete(categoryId) {
    await this.getById(categoryId); // Kiểm tra tồn tại

    // Lấy các sản phẩm thuộc category này
    const products = await productRepository.search({ categoryId });

    // Cập nhật categoryId = null cho các sản phẩm
    for (const product of products) {
      await productRepository.update(product.id, { categoryId: null });
    }

    // Xóa category
    await categoryRepository.delete(categoryId);
  }
}

module.exports = new CategoryService();
