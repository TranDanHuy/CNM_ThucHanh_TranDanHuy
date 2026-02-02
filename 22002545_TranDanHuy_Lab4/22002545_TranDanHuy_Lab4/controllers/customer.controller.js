/**
 * Customer Controller
 * Giao diện khách hàng (Mini E-commerce)
 */

const productService = require("../services/product.service");
const categoryService = require("../services/category.service");
const orderService = require("../services/order.service");

class CustomerController {
    // Trang chủ - Danh sách sản phẩm cho khách
    async home(req, res) {
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

            const products = await productService.search(filters);
            const categories = await categoryService.getAll();

            // Thêm stock status
            products.forEach(p => {
                p.stockStatus = productService.getStockStatus(p.quantity);
            });

            res.render("customer/home", {
                products,
                categories,
                filters: { keyword, categoryId, minPrice, maxPrice }
            });
        } catch (error) {
            req.flash("error", error.message);
            res.render("customer/home", { products: [], categories: [], filters: {} });
        }
    }

    // Chi tiết sản phẩm
    async productDetail(req, res) {
        try {
            const product = await productService.getById(req.params.id);
            product.stockStatus = productService.getStockStatus(product.quantity);

            res.render("customer/product-detail", { product });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/shop");
        }
    }

    // Giỏ hàng
    showCart(req, res) {
        const cart = req.session.cart || [];

        // Tính tổng tiền
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        res.render("customer/cart", { cart, total });
    }

    // Thêm vào giỏ
    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            const product = await productService.getById(productId);

            if (!req.session.cart) {
                req.session.cart = [];
            }

            // Kiểm tra sản phẩm đã có trong giỏ chưa
            const existingItem = req.session.cart.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += parseInt(quantity);
            } else {
                req.session.cart.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: parseInt(quantity),
                    image: product.url_image
                });
            }

            req.flash("success", "Đã thêm vào giỏ hàng");
            res.redirect("/shop/cart");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/shop");
        }
    }

    // Xóa khỏi giỏ
    removeFromCart(req, res) {
        const { productId } = req.params;

        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        }

        req.flash("success", "Đã xóa khỏi giỏ hàng");
        res.redirect("/shop/cart");
    }

    // Form checkout
    showCheckout(req, res) {
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            req.flash("error", "Giỏ hàng trống");
            return res.redirect("/shop/cart");
        }

        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        res.render("customer/checkout", { cart, total });
    }

    // Xử lý đặt hàng
    async processCheckout(req, res) {
        try {
            const { name, email, phone, address } = req.body;
            const cart = req.session.cart || [];

            if (cart.length === 0) {
                req.flash("error", "Giỏ hàng trống");
                return res.redirect("/shop/cart");
            }

            // Tạo đơn hàng
            const items = cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            const { order } = await orderService.createOrder({ name, email, phone, address },
                items
            );

            // Xóa giỏ hàng
            req.session.cart = [];

            req.flash("success", "Đặt hàng thành công!");
            res.redirect(`/shop/order-success/${order.orderId}`);
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/shop/checkout");
        }
    }

    // Trang thành công
    async orderSuccess(req, res) {
        try {
            const { order, items } = await orderService.getOrderDetail(req.params.orderId);
            res.render("customer/order-success", { order, items });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/shop");
        }
    }

    // Tra cứu đơn hàng
    showOrderTracking(req, res) {
        res.render("customer/order-tracking");
    }

    // Xử lý tra cứu
    async trackOrder(req, res) {
        try {
            const { email } = req.body;
            const orders = await orderService.getCustomerOrders(email);

            res.render("customer/order-tracking", { orders, email });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/shop/track-order");
        }
    }
}

module.exports = new CustomerController();