
const EventEmitter = require('events');
const fs = require('fs');

// 1. Tạo Class kế thừa EventEmitter
class StudentLogger extends EventEmitter {
    
    logActivity(studentName, action) {
        
        const timestamp = new Date().toLocaleString();
        const message = `[${timestamp}] SINH VIÊN: ${studentName} - HÀNH ĐỘNG: ${action}`;

        
        this.emit('action-detected', message);
    }
}

// 2. Khởi tạo đối tượng
const logger = new StudentLogger();

// 3. Đăng ký người lắng nghe (Listener)

logger.on('action-detected', (message) => {
    console.log("Sự kiện mới: ".yellow + message); 
    
    
    fs.appendFile('activity.log', message + '\n', (err) => {
        if (err) throw err;
        
    });
});

// 4. Mô phỏng hành động của sinh viên 
console.log("--- BẮT ĐẦU GHI NHẬT KÝ ---");

logger.logActivity("Nguyen Van A", "Đăng nhập hệ thống");
logger.logActivity("Tran Thi B", "Nộp bài Lab 1");
logger.logActivity("Nguyen Van A", "Đăng xuất");


setTimeout(() => {
    logger.logActivity("Le Van C", "Vào muộn 2 giây");
}, 2000);