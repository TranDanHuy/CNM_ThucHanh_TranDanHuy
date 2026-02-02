/**
 * Upload Middleware
 * Xử lý upload file với Multer
 */

const multer = require("multer");

// Cấu hình multer - lưu vào memory để upload lên S3
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Chỉ cho phép upload ảnh
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ được upload file ảnh"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

module.exports = upload;