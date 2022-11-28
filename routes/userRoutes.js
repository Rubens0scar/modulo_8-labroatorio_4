const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const userRouter = express.Router();
//routes
userRouter
  .route("/")
  .all(authController.protect)
  .post(userController.addUser)
  .get(userController.getAllUser);
userRouter
  .route("/:id")
  .all(authController.protect)
  .get(userController.getUserById)
  .delete(userController.deleteUserById)
  .put(userController.updateUserById);

module.exports = userRouter;