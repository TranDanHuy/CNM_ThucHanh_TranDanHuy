/**
 * Authentication Service
 * Xử lý đăng ký, đăng nhập, hash password
 */

const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const userRepository = require("../repositories/user.repository");

class AuthService {
  /**
   * Đăng ký user mới
   */
  async register(username, password, role = "staff") {
    // Kiểm tra user đã tồn tại
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error("Username đã tồn tại");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const user = {
      userId: randomUUID(),
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    return await userRepository.create(user);
  }

  /**
   * Đăng nhập
   */
  async login(username, password) {
    // Tìm user
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error("Sai tên đăng nhập hoặc mật khẩu");
    }

    // Kiểm tra password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Sai tên đăng nhập hoặc mật khẩu");
    }

    // Không trả về password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Tạo admin mặc định (chạy 1 lần khi setup)
   */
  async createDefaultAdmin() {
    try {
      const existingAdmin = await userRepository.findByUsername("admin");
      if (!existingAdmin) {
        await this.register("admin", "admin123", "admin");
        console.log("✅ Default admin created: admin/admin123");
      }
    } catch (error) {
      console.error("Error creating default admin:", error.message);
    }
  }
}

module.exports = new AuthService();
