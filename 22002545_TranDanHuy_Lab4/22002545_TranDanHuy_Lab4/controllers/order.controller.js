/**
 * Order Controller
 * Quản lý đơn hàng
 */

const orderService = require("../services/order.service");

class OrderController {
    // Danh sách đơn hàng (Admin)
    async getAll(req, res) {
        try {
            const orders = await orderService.getAllOrders();
            res.render("orders/list", { orders });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/");
        }
    }

    // Chi tiết đơn hàng
    async getDetail(req, res) {
        try {
            const { order, items } = await orderService.getOrderDetail(req.params.id);
            res.render("orders/detail", { order, items });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/orders");
        }
    }

    // Cập nhật trạng thái
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            await orderService.updateStatus(req.params.id, status);

            req.flash("success", "Cập nhật trạng thái thành công");
            res.redirect(`/orders/${req.params.id}`);
        } catch (error) {
            req.flash("error", error.message);
            res.redirect(`/orders/${req.params.id}`);
        }
    }
}

module.exports = new OrderController();