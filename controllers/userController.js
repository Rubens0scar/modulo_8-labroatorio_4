const fs = require("fs");
const crypto = require("crypto");
const { User }= require("../models");
const catchAsync = require("../utils/catchAsync");

exports.addUser = catchAsync(async (req, res) => {
  req.body.password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  let newUser = User.build(req.body);
  newUser = await newUser.save();
  delete newUser.password;

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.getAllUser = catchAsync(async (req, res) => {
    const user = await User.findAll();
    res.status(200).json({
      status: "success",
      timeOfRequest: req.requestTime,
      results: user.length,
      data: {
        user,
      },
    });
});

exports.getUserById = catchAsync(async (req, res) => {
    const foundUser = await User.findByPk(req.params.id);
    if (foundUser) {
      res.status(200).json({
        status: "success",
        data: {
          user: foundUser,
        },
      });
    } else {
      res.status(404).json({
        status: "not found",
      });
    }
});

exports.deleteUserById = catchAsync(async (req, res) => {
    const foundUser = await User.findByPk(req.params.id);
    if (foundUser) {
      User.findByPk(req.params.id).then(function(foundUser) {
        foundUser.destroy();
      }).then((foundUser) => {
        res.sendStatus(200);
      });
    } else {
      res.status(404).json({
        status: "not found",
      });
    }
});

exports.updateUserById = catchAsync(async (req, res) => {
    const foundUser = await User.findByPk(req.params.id);
    if (foundUser) {
        req.body.password = crypto
            .createHash("sha256")
            .update(req.body.password)
            .digest("hex");

        User.findByPk(req.params.id).then(function(foundUser) {
        foundUser.update({
          userName: req.body.userName==="undefined"?foundUser.userName:req.body.userName, 
          password: req.body.password==="undefined"?foundUser.password:req.body.password, 
          email: req.body.email==="undefined"?foundUser.email:req.body.email, 
        }).then((foundUser) => {
          res.json(foundUser);
        });
      });
    } else {
      res.status(404).json({
        status: "not found",
      });
    }
  });