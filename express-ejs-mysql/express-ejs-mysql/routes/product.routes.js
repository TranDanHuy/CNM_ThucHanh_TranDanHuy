const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// Home
router.get('/', async(req, res) => {
    const [rows] = await db.query('SELECT * FROM products');
    res.render('products', { products: rows, keyword: '' });
});

// Tìm kiếm
router.get('/search', async(req, res) => {
    const { keyword } = req.query;
    const [rows] = await db.query(
        'SELECT * FROM products WHERE name LIKE ?', [`%${keyword}%`]
    );
    res.render('products', { products: rows, keyword });
});

// Add product
router.post('/add', async(req, res) => {
    const { name, price, quantity } = req.body;
    await db.query(
        'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)', [name, price, quantity]
    );
    res.redirect('/');
});

// Sửa product - GET form
router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.redirect('/');
    res.render('edit-product', { product: rows[0] });
});

// Sửa product - POST
router.post('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    await db.query(
        'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]
    );
    res.redirect('/');
});

// Xóa product
router.get('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.redirect('/');
});

module.exports = router;