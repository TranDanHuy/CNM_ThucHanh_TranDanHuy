/**
 * Customer Routes (Public - E-commerce)
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/customer.controller");

// Trang chủ shop
router.get("/", controller.home);

// Chi tiết sản phẩm
router.get("/product/:id", controller.productDetail);

// Giỏ hàng
router.get("/cart", controller.showCart);
router.post("/cart/add", controller.addToCart);
router.get("/cart/remove/:productId", controller.removeFromCart);

// Checkout
router.get("/checkout", controller.showCheckout);
router.post("/checkout", controller.processCheckout);

// Thành công
router.get("/order-success/:orderId", controller.orderSuccess);

// Tra cứu đơn hàng
router.get("/track-order", controller.showOrderTracking);
router.post("/track-order", controller.trackOrder);

module.exports = router;