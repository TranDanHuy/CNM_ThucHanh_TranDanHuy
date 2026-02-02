/**
 * Mini E-Commerce Application
 * Lab 4 - Advanced Features with DynamoDB & AWS
 */

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

// Import routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const customerRoutes = require("./routes/customer.routes");

// Import middlewares
const { setUserLocals, setFlashLocals } = require("./middlewares/auth.middleware");

// Import services
const authService = require("./services/auth.service");

// Session configuration
const sessionConfig = require("./config/session.config");

// View engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use('/uploads', express.static('public/uploads'));

// Session
app.use(session(sessionConfig));
app.use(flash());

// Flash messages & user locals
app.use(setUserLocals);
app.use(setFlashLocals);

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/shop", customerRoutes);

// Home redirect
app.get("/", (req, res) => {
    res.redirect("/shop");
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    req.flash("error", err.message || "Đã xảy ra lỗi");
    res.redirect("/");
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => {
    console.log(`
╔════════════════════════════════════════════╗
║   🛒 Mini E-Commerce Server Started        ║
║                                            ║
║   🌐 URL: http://localhost:${PORT}          ║
║   📚 Shop: http://localhost:${PORT}/shop    ║
║   🔐 Admin: http://localhost:${PORT}/auth/login ║
║                                            ║
║   Default Admin: admin / admin123          ║
╚════════════════════════════════════════════╝
    `);

    // Tạo admin mặc định
    try {
        await authService.createDefaultAdmin();
    } catch (error) {
        console.error("Error creating default admin:", error.message);
    }
});