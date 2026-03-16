const { docClient, TABLE_NAME } = require('../models/productModel');
const fs = require('fs');
const path = require('path');

// 1. Hiển thị danh sách sản phẩm + Xử lý tìm kiếm
exports.getAllProducts = async(req, res) => {
    try {
        const { search } = req.query; // Lấy từ khóa 'search' từ thanh địa chỉ
        const data = await docClient.scan({ TableName: TABLE_NAME }).promise();
        let products = data.Items;

        // Nếu có từ khóa tìm kiếm, thực hiện lọc danh sách
        if (search) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Truyền searchTerm sang EJS để hiển thị lại trong ô input và xử lý nút Xóa
        res.render('index', {
            products,
            message: req.query.msg,
            searchTerm: search || ""
        });
    } catch (err) {
        res.status(500).send("Lỗi hệ thống: " + err.message);
    }
};

// 2. Thêm sản phẩm mới
exports.addProduct = async(req, res) => {
    try {
        const { name, price, unit_in_stock } = req.body;
        const newItem = {
            id: Date.now().toString(),
            name,
            price: Number(price),
            unit_in_stock: Number(unit_in_stock),
            url_image: req.file ? `/uploads/${req.file.filename}` : ""
        };
        await docClient.put({ TableName: TABLE_NAME, Item: newItem }).promise();
        res.redirect('/?msg=Thêm thành công!');
    } catch (err) {
        res.redirect('/?msg=Lỗi khi thêm sản phẩm');
    }
};

// 3. Xem chi tiết sản phẩm
exports.getProductDetail = async(req, res) => {
    const params = { TableName: TABLE_NAME, Key: { id: req.params.id } };
    const data = await docClient.get(params).promise();
    res.render('detail', { product: data.Item });
};

// 4. Lấy form sửa sản phẩm
exports.getEditForm = async(req, res) => {
    const params = { TableName: TABLE_NAME, Key: { id: req.params.id } };
    const data = await docClient.get(params).promise();
    res.render('edit', { product: data.Item });
};

// 5. Cập nhật sản phẩm
exports.updateProduct = async(req, res) => {
    try {
        const { id, name, price, unit_in_stock, old_image } = req.body;
        let url_image = old_image;

        if (req.file) {
            url_image = `/uploads/${req.file.filename}`;
            const oldPath = path.join(__dirname, '../public', old_image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const params = {
            TableName: TABLE_NAME,
            Item: { id, name, price: Number(price), unit_in_stock: Number(unit_in_stock), url_image }
        };
        await docClient.put(params).promise();
        res.redirect('/?msg=Cập nhật thành công!');
    } catch (err) {
        res.redirect('/?msg=Lỗi khi cập nhật');
    }
};

// 6. Xóa sản phẩm
exports.deleteProduct = async(req, res) => {
    try {
        const params = { TableName: TABLE_NAME, Key: { id: req.params.id } };
        const item = await docClient.get(params).promise();
        if (item.Item && item.Item.url_image) {
            const imgPath = path.join(__dirname, '../public', item.Item.url_image);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
        await docClient.delete(params).promise();
        res.redirect('/?msg=Xóa thành công!');
    } catch (err) {
        res.redirect('/?msg=Lỗi khi xóa');
    }
};