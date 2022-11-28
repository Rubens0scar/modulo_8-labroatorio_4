const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");
const productRouter = express.Router();
//routes
productRouter
  .route("/")
  .all(authController.protect)
  .get(productController.getAllProducts)
  .post(productController.addProduct);
productRouter
  .route("/:id")
  .all(authController.protect)
  .get(productController.getProductById)
  .delete(productController.deleteProductById)
  .put(productController.updateProductById);

module.exports = productRouter;