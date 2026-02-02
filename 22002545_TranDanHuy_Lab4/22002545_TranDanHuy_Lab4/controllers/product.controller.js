/**
 * Product Controller (Admin)
 * Quản lý sản phẩm với DynamoDB, S3, Audit Log
 */

const productService = require("../services/product.service");
const categoryService = require("../services/category.service");
const productLogRepository = require("../repositories/productLog.repository");

class ProductController {
  // Danh sách sản phẩm + Tìm kiếm & Lọc
  async getAll(req, res) {
    try {
      const keyword = req.query.keyword || "";
      const categoryId = req.query.category || "";
      const minPrice = req.query.minPrice || "";
      const maxPrice = req.query.maxPrice || "";

      const filters = {};
      if (keyword) filters.keyword = keyword;
      if (categoryId) filters.categoryId = categoryId;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const result = await productService.search(filters, page, limit);
      const products = result.items;
      const categories = await categoryService.getAll();

      // Thêm stock status
      products.forEach((p) => {
        p.stockStatus = productService.getStockStatus(p.quantity);
      });

      res.render("products/list", {
        products,
        categories,
        filters: { keyword, categoryId, minPrice, maxPrice },
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      req.flash("error", error.message);
      res.render("products/list", {
        products: [],
        categories: [],
        filters: {},
      });
    }
  }

  // Form thêm
  async showAddForm(req, res) {
    try {
      const categories = await categoryService.getAll();
      res.render("products/add", { categories });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/products");
    }
  }

  // Thêm sản phẩm
  async create(req, res) {
    try {
      const userId = req.session.user.userId;
      const imageFile = req.file;

      await productService.create(req.body, userId, imageFile);

      req.flash("success", "Thêm sản phẩm thành công");
      res.redirect("/products");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/products/add");
    }
  }

  // Form sửa
  async showEditForm(req, res) {
    try {
      const product = await productService.getById(req.params.id);
      const categories = await categoryService.getAll();
      res.render("products/edit", { product, categories });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/products");
    }
  }

  // Cập nhật
  async update(req, res) {
    try {
      const userId = req.session.user.userId;
      const imageFile = req.file;

      await productService.update(req.params.id, req.body, userId, imageFile);

      req.flash("success", "Cập nhật sản phẩm thành công");
      res.redirect("/products");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect(`/products/edit/${req.params.id}`);
    }
  }

  // Xóa (Soft Delete)
  async delete(req, res) {
    try {
      const userId = req.session.user.userId;
      await productService.delete(req.params.id, userId);

      req.flash("success", "Xóa sản phẩm thành công");
      res.redirect("/products");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/products");
    }
  }

  // Lịch sử thao tác
  async showLogs(req, res) {
    try {
      const logs = await productLogRepository.getAll();
      res.render("products/logs", { logs });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/products");
    }
  }
}

module.exports = new ProductController();
