require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const { ensureTable } = require("./models/productModel");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", productRoutes);

const PORT = process.env.PORT || 3000;

// Ensure table exists then start
ensureTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to ensure DynamoDB table:", err);
    process.exit(1);
  });
