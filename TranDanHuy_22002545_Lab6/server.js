const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('./controllers/productController');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Cấu hình Multer [cite: 6]
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Định nghĩa Routes
app.get('/', productController.getAllProducts);
app.get('/add', (req, res) => res.render('add'));
app.post('/add', upload.single('image'), productController.addProduct);
app.get('/detail/:id', productController.getProductDetail);
app.get('/edit/:id', productController.getEditForm);
app.post('/edit', upload.single('image'), productController.updateProduct);
app.get('/delete/:id', productController.deleteProduct);

app.listen(3000, () => console.log('Server running at http://localhost:3000'));