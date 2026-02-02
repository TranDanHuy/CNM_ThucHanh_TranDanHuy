/**
 * Authentication Middleware
 * Kiểm tra đăng nhập
 */

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Vui lòng đăng nhập");
    return res.redirect("/auth/login");
  }
  next();
}

/**
 * Kiểm tra quyền admin
 */
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    req.flash("error", "Bạn không có quyền truy cập");
    return res.redirect("/");
  }
  next();
}

/**
 * Kiểm tra quyền admin hoặc staff
 */
function requireAdminOrStaff(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Vui lòng đăng nhập");
    return res.redirect("/auth/login");
  }

  const allowedRoles = ["admin", "staff"];
  if (!allowedRoles.includes(req.session.user.role)) {
    req.flash("error", "Bạn không có quyền truy cập");
    return res.redirect("/");
  }

  next();
}

/**
 * Middleware để truyền user vào views
 */
function setUserLocals(req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user && req.session.user.role === "admin";
  res.locals.isStaff = req.session.user && req.session.user.role === "staff";
  next();
}

/**
 * Middleware để truyền flash messages
 */
function setFlashLocals(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireAdminOrStaff,
  setUserLocals,
  setFlashLocals,
};
