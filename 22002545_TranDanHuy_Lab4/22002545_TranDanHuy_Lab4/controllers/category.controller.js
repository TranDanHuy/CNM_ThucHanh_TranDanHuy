/**
 * Category Controller
 * Quản lý danh mục sản phẩm
 */

const categoryService = require("../services/category.service");

class CategoryController {
    // Danh sách category
    async getAll(req, res) {
        try {
            const categories = await categoryService.getAll();
            res.render("categories/list", { categories });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/");
        }
    }

    // Form thêm
    showAddForm(req, res) {
        res.render("categories/add");
    }

    // Thêm category
    async create(req, res) {
        try {
            const { name, description } = req.body;
            await categoryService.create(name, description);

            req.flash("success", "Thêm danh mục thành công");
            res.redirect("/categories");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/categories/add");
        }
    }

    // Form sửa
    async showEditForm(req, res) {
        try {
            const category = await categoryService.getById(req.params.id);
            res.render("categories/edit", { category });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/categories");
        }
    }

    // Cập nhật
    async update(req, res) {
        try {
            const { name, description } = req.body;
            await categoryService.update(req.params.id, name, description);

            req.flash("success", "Cập nhật danh mục thành công");
            res.redirect("/categories");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/categories");
        }
    }

    // Xóa
    async delete(req, res) {
        try {
            await categoryService.delete(req.params.id);
            req.flash("success", "Xóa danh mục thành công");
            res.redirect("/categories");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/categories");
        }
    }
}

module.exports = new CategoryController();