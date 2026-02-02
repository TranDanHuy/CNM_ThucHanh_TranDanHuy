/**
 * Order Routes (Admin)
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");
const { requireAdmin } = require("../middlewares/auth.middleware");

// Tất cả routes cần quyền admin
router.use(requireAdmin);

router.get("/", controller.getAll);
router.get("/:id", controller.getDetail);
router.post("/:id/status", controller.updateStatus);

module.exports = router;