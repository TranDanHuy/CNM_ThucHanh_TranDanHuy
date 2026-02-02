/**
 * Product Service
 * Business logic cho quản lý sản phẩm
 */

const { randomUUID } = require("crypto");
const productRepository = require("../repositories/product.repository");
const productLogRepository = require("../repositories/productLog.repository");
const s3Service = require("./s3.service");

class ProductService {
  /**
   * Tạo sản phẩm mới
   */
  async create(data, userId, imageFile = null) {
    let imageUrl = null;

    // Upload ảnh lên S3 nếu có
    if (imageFile) {
      imageUrl = await s3Service.uploadImage(imageFile);
    }

    const product = {
      id: randomUUID(),
      name: data.name,
      price: Number(data.price),
      quantity: Number(data.quantity),
      categoryId: data.categoryId || null,
      url_image: imageUrl,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };

    const created = await productRepository.create(product);

    // Ghi log
    await this.logAction(created.id, "CREATE", userId);

    return created;
  }

  /**
   * Lấy tất cả sản phẩm (không bao gồm đã xóa)
   */
  async getAll() {
    return await productRepository.getAll(false);
  }

  /**
   * Tìm kiếm và lọc sản phẩm
   */
  async search(filters, page = 1, limit = 10) {
    const results = await productRepository.search(filters);

    const total = results.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);

    const start = (currentPage - 1) * limit;
    const items = results.slice(start, start + Number(limit));

    return {
      items,
      total,
      page: currentPage,
      limit: Number(limit),
      totalPages,
    };
  }

  /**
   * Lấy sản phẩm theo ID
   */
  async getById(id) {
    const product = await productRepository.findById(id);
    if (!product || product.isDeleted) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    return product;
  }

  /**
   * Cập nhật sản phẩm
   */
  async update(id, data, userId, imageFile = null) {
    const product = await this.getById(id);

    // Upload ảnh mới nếu có
    if (imageFile) {
      // Xóa ảnh cũ
      if (product.url_image) {
        await s3Service.deleteImage(product.url_image);
      }
      data.url_image = await s3Service.uploadImage(imageFile);
    }

    const updated = await productRepository.update(id, data);

    // Ghi log
    await this.logAction(id, "UPDATE", userId);

    return updated;
  }

  /**
   * Xóa sản phẩm (Soft Delete)
   */
  async delete(id, userId) {
    const product = await this.getById(id);

    // Xóa ảnh trên S3
    if (product.url_image) {
      await s3Service.deleteImage(product.url_image);
    }

    // Soft delete
    await productRepository.softDelete(id);

    // Ghi log
    await this.logAction(id, "DELETE", userId);
  }

  /**
   * Kiểm tra trạng thái tồn kho
   */
  getStockStatus(quantity) {
    if (quantity === 0)
      return { status: "out_of_stock", label: "Hết hàng", class: "danger" };
    if (quantity < 5)
      return { status: "low_stock", label: "Sắp hết", class: "warning" };
    return { status: "in_stock", label: "Còn hàng", class: "success" };
  }

  /**
   * Ghi log thao tác
   */
  async logAction(productId, action, userId) {
    const log = {
      logId: randomUUID(),
      productId,
      action,
      userId,
      time: new Date().toISOString(),
    };

    await productLogRepository.create(log);
  }

  /**
   * Lấy lịch sử thao tác của sản phẩm
   */
  async getProductLogs(productId) {
    return await productLogRepository.getLogsByProductId(productId);
  }

  /**
   * Giảm số lượng khi đặt hàng
   */
  async decreaseQuantity(productId, amount) {
    const product = await this.getById(productId);

    if (product.quantity < amount) {
      throw new Error(`Không đủ hàng. Chỉ còn ${product.quantity} sản phẩm`);
    }

    const newQuantity = product.quantity - amount;
    await productRepository.update(productId, { quantity: newQuantity });
  }
}

module.exports = new ProductService();
