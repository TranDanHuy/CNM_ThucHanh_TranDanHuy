const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");

router.get("/", ctrl.index);
router.get("/products/new", ctrl.newForm);
router.post("/products", ctrl.create);
router.get("/products/:id/edit", ctrl.editForm);
router.post("/products/:id/update", ctrl.update);
router.post("/products/:id/delete", ctrl.remove);

module.exports = router;
