/**
 * File Service - Local Storage (No AWS S3)
 * Lưu file vào thư mục public/uploads
 */

const path = require("path");
const fs = require("fs").promises;
const { randomUUID } = require("crypto");

class FileService {
  constructor() {
    this.uploadDir = path.join(__dirname, "../public/uploads");
    this.ensureUploadDir();
  }

  async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error("Error creating upload directory:", error);
    }
  }

  /**
   * Upload ảnh lên local storage
   */
  async uploadImage(file) {
    try {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);

      // Return web-accessible URL
      return `/uploads/${fileName}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  /**
   * Xóa ảnh từ local storage
   */
  async deleteImage(imageUrl) {
    try {
      if (!imageUrl || !imageUrl.includes("/uploads/")) return;

      const fileName = path.basename(imageUrl);
      const filePath = path.join(this.uploadDir, fileName);

      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Don't throw - file might not exist
    }
  }
}

module.exports = new FileService();
