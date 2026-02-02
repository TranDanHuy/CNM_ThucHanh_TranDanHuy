/**
 * Order Service
 * Business logic cho đơn hàng (E-commerce)
 */

const { randomUUID } = require("crypto");
const orderRepository = require("../repositories/order.repository");
const orderItemRepository = require("../repositories/orderItem.repository");
const productService = require("./product.service");

class OrderService {
  /**
   * Tạo đơn hàng mới
   * @param {Object} customerInfo - { name, email, phone, address }
   * @param {Array} items - [{ productId, quantity }]
   */
  async createOrder(customerInfo, items) {
    if (!items || items.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    // Tính tổng tiền và validate sản phẩm
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await productService.getById(item.productId);

      // Kiểm tra số lượng
      if (product.quantity < item.quantity) {
        throw new Error(`Sản phẩm "${product.name}" không đủ hàng`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        itemId: randomUUID(),
        orderId: null, // Sẽ set sau
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemTotal,
      });
    }

    // Tạo order
    const orderId = randomUUID();
    const order = {
      orderId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      totalAmount,
      status: "pending", // pending, confirmed, shipping, completed, cancelled
      createdAt: new Date().toISOString(),
    };

    await orderRepository.create(order);

    // Tạo order items
    orderItems.forEach((item) => (item.orderId = orderId));
    await orderItemRepository.createBatch(orderItems);

    // Giảm số lượng sản phẩm
    for (const item of items) {
      await productService.decreaseQuantity(item.productId, item.quantity);
    }

    return { order, items: orderItems };
  }

  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrderDetail(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    const items = await orderItemRepository.getItemsByOrderId(orderId);
    return { order, items };
  }

  /**
   * Lấy tất cả đơn hàng
   */
  async getAllOrders() {
    return await orderRepository.getAll();
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateStatus(orderId, status) {
    const validStatuses = [
      "pending",
      "confirmed",
      "shipping",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    return await orderRepository.updateStatus(orderId, status);
  }

  /**
   * Lấy đơn hàng của khách hàng
   */
  async getCustomerOrders(email) {
    return await orderRepository.getOrdersByCustomer(email);
  }
}

module.exports = new OrderService();
