
const fs = require('fs'); 
const colors = require('colors'); 

const noiDungGhi = "Chào bạn, đây là nội dung được ghi từ Node.js!";

// 1. Ghi file (Asynchronous - Bất đồng bộ)
console.log("Đang bắt đầu ghi file...".yellow);

fs.writeFile('data.txt', noiDungGhi, (err) => {
    if (err) {
        console.log("Lỗi ghi file!".red);
    } else {
        console.log("Ghi file thành công!".green);

        // 2. Đọc file ngay sau khi ghi xong
        fs.readFile('data.txt', 'utf-8', (err, data) => {
            if (err) {
                console.log("Lỗi đọc file!".red);
            } else {
                console.log("Nội dung trong file là:".cyan);
                console.log(data.bgBlue.white); 
            }
        });
    }
});