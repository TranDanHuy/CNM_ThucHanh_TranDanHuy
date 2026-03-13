const express = require("express");
const router = express.Router();

const multer = require("multer");
const multerS3 = require("multer-s3");

const { s3 } = require("../config/aws");
const productController = require("../controllers/productController");

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: function(req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    })
});

router.get("/", productController.index);

router.get("/add", productController.showAdd);
router.post("/add", upload.single("image"), productController.add);

router.get("/edit/:id", productController.showEdit);
router.post("/edit/:id", upload.single("image"), productController.update);

router.get("/delete/:id", productController.delete);

module.exports = router;