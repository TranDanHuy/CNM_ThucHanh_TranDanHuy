const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/product.routes"));

app.listen(3000, () =>
  console.log("Server running on port 3000")
);
