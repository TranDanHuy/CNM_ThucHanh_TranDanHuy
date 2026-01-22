const { v4: uuidv4 } = require("uuid");
const db = require("../services/dynamodb.service");
const s3 = require("../services/s3.service");

exports.list = async (req, res) => {
  const data = await db.getAll();
  res.render("products", { products: data.Items || [] });
};

exports.showAdd = (req, res) => {
  res.render("add");
};

exports.create = async (req, res) => {
  const imageUrl = await s3.uploadImage(req.file);

  await db.create({
    id: uuidv4(),
    name: req.body.name,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    url_image: imageUrl
  });

  res.redirect("/");
};

exports.showEdit = async (req, res) => {
  const data = await db.getById(req.params.id);
  res.render("edit", { product: data.Item });
};

exports.update = async (req, res) => {
  let imageUrl = req.body.oldImage;

  if (req.file) {
    imageUrl = await s3.uploadImage(req.file);
  }

  await db.update(req.params.id, {
    name: req.body.name,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    url_image: imageUrl
  });

  res.redirect("/");
};

exports.delete = async (req, res) => {
  await db.delete(req.params.id);
  res.redirect("/");
};
