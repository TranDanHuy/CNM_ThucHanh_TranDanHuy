/**
 * Product Routes (Admin)
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");
const {
  requireAdmin,
  requireAdminOrStaff,
} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// Cho phép 'staff' và 'admin' xem danh sách
router.get("/", requireAdminOrStaff, controller.getAll);

// Các route quản trị còn lại chỉ admin
router.get("/add", requireAdmin, controller.showAddForm);
router.post("/add", requireAdmin, upload.single("image"), controller.create);

router.get("/edit/:id", requireAdmin, controller.showEditForm);
router.post(
  "/edit/:id",
  requireAdmin,
  upload.single("image"),
  controller.update,
);

router.get("/delete/:id", requireAdmin, controller.delete);

// Lịch sử thao tác (chỉ admin)
router.get("/logs", requireAdmin, controller.showLogs);

module.exports = router;
