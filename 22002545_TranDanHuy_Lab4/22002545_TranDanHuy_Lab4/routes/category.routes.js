/**
 * Category Routes (Admin)
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const { requireAdmin } = require("../middlewares/auth.middleware");

// Tất cả routes cần quyền admin
router.use(requireAdmin);

router.get("/", controller.getAll);
router.get("/add", controller.showAddForm);
router.post("/add", controller.create);

router.get("/edit/:id", controller.showEditForm);
router.post("/edit/:id", controller.update);

router.get("/delete/:id", controller.delete);

module.exports = router;