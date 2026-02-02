/**
 * Authentication Routes
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

router.get("/login", controller.showLoginForm);
router.post("/login", controller.login);

router.get("/register", controller.showRegisterForm);
router.post("/register", controller.register);

router.get("/logout", controller.logout);

module.exports = router;