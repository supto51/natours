const express = require("express");
const usersController = require("./../controller/usersController");
const authController = require("./../controller/authController");
const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);

router.route("/me").get(authController.protect, usersController.getMe, usersController.getUser);

router.route("/forgot-password").post(authController.protect, authController.forgotPassword);
router.route("/reset-password/:token").patch(authController.protect, authController.resetPassword);
router.route("/update-password").patch(authController.protect, authController.updatePassword);

router.route("/update-user").patch(authController.protect, usersController.updateCurrentUser);

router
  .route("delete-current-user")
  .delete(authController.protect, usersController.deleteCurrentUser);

router.route("/").get(usersController.getAllUsers).post(usersController.createUser);
router
  .route("/:id")
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
