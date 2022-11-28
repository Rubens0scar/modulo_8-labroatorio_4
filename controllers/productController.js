const fs = require("fs");
const { Product } = require("../models");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.findAll();
  res.status(200).json({
    status: "success",
    timeOfRequest: req.requestTime,
    results: products.length,
    data: {
      products,
    },
  });
});

exports.addProduct = catchAsync(async (req, res) => {
  let newProduct = Product.build(req.body);
  newProduct = await newProduct.save();
  res.status(200).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

exports.getProductById = catchAsync(async (req, res) => {
  const foundProduct = await Product.findByPk(req.params.id);
  if (foundProduct) {
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});

exports.deleteProductById = catchAsync(async (req, res) => {
  const foundProduct = await Product.findByPk(req.params.id);
  if (foundProduct) {
    Product.findByPk(req.params.id).then(function(foundProduct) {
      foundProduct.destroy();
    }).then((foundProduct) => {
      res.sendStatus(200);
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});

exports.updateProductById = catchAsync(async (req, res) => {
  const foundProduct = await Product.findByPk(req.params.id);
  if (foundProduct) {
    Product.findByPk(req.params.id).then(function(foundProduct) {
      foundProduct.update({
        productName: req.body.productName==="undefined"?foundProduct.productName:req.body.productName, 
        price: req.body.price==="undefined"?foundProduct.price:req.body.price, 
        description: req.body.description==="undefined"?foundProduct.description:req.body.description, 
      }).then((foundProduct) => {
        res.json(foundProduct);
      });
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});