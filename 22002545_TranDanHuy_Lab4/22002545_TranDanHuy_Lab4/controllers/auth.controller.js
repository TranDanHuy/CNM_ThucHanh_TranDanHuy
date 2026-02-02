/**
 * Authentication Controller
 * Xử lý đăng nhập, đăng ký, đăng xuất
 */

const authService = require("../services/auth.service");

class AuthController {
    // Hiển thị form đăng nhập
    showLoginForm(req, res) {
        res.render("auth/login");
    }

    // Xử lý đăng nhập
    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await authService.login(username, password);

            // Lưu vào session
            req.session.user = user;

            req.flash("success", `Chào mừng ${user.username}!`);
            res.redirect("/products");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/auth/login");
        }
    }

    // Hiển thị form đăng ký
    showRegisterForm(req, res) {
        res.render("auth/register");
    }

    // Xử lý đăng ký
    async register(req, res) {
        try {
            const { username, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                req.flash("error", "Mật khẩu không khớp");
                return res.redirect("/auth/register");
            }

            await authService.register(username, password, "staff");

            req.flash("success", "Đăng ký thành công! Vui lòng đăng nhập");
            res.redirect("/auth/login");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/auth/register");
        }
    }

    // Đăng xuất
    logout(req, res) {
        req.session.destroy();
        res.redirect("/auth/login");
    }
}

module.exports = new AuthController();