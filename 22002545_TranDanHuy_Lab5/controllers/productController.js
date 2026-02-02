const { v4: uuidv4 } = require("uuid");
const model = require("../models/productModel");

async function index(req, res) {
  const products = await model.getProducts();
  res.render("index", { products });
}

function newForm(req, res) {
  res.render("new");
}

async function create(req, res) {
  const { id, name, price, url_image } = req.body;
  const item = {
    id: id && id.trim() ? id.trim() : uuidv4(),
    name,
    price: Number(price),
    url_image,
  };
  await model.createProduct(item);
  res.redirect("/");
}

async function editForm(req, res) {
  const product = await model.getProductById(req.params.id);
  if (!product) return res.redirect("/");
  res.render("edit", { product });
}

async function update(req, res) {
  const id = req.params.id;
  const { name, price, url_image } = req.body;
  await model.updateProduct(id, { name, price: Number(price), url_image });
  res.redirect("/");
}

async function remove(req, res) {
  const id = req.params.id;
  await model.deleteProduct(id);
  res.redirect("/");
}

module.exports = { index, newForm, create, editForm, update, remove };
