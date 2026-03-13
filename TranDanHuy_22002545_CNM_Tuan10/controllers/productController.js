const Product = require("../models/productModel");
exports.index = async(req, res) => {

    const keyword = req.query.keyword;

    let products;

    if (keyword) {
        products = await Product.search(keyword);
    } else {
        products = await Product.getAll();
    }

    res.render("index", { products });

};

exports.showAdd = (req, res) => {

    res.render("product-form", {
        title: "Add Product",
        action: "/add",
        button: "Add",
        product: null
    });

};

exports.add = async(req, res) => {

    const product = {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.file.location
    };

    await Product.create(product);

    res.redirect("/");
};

exports.showEdit = async(req, res) => {

    const id = req.params.id;

    const product = await Product.getById(id);

    res.render("product-form", {
        title: "Edit Product",
        action: "/edit/" + id,
        button: "Update",
        product: product
    });

};

exports.update = async(req, res) => {

    const id = req.params.id;

    const old = await Product.getById(id);

    let image = old.image;

    if (req.file) {
        image = req.file.location;
    }

    const product = {
        id,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        image
    };

    await Product.update(product);

    res.redirect("/");
};

exports.delete = async(req, res) => {

    const id = req.params.id;

    await Product.delete(id);

    res.redirect("/");
};