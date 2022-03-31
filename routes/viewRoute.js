const express = require("express");
const viewController = require("./../controller/viewController");
const authController = require("./../controller/authController");

const route = express.Router();

route.get("/", authController.isLoggedIn, viewController.getOverview);
route.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
route.get("/login", authController.isLoggedIn, viewController.login);
route.get("/account", authController.protect, viewController.account);

module.exports = route;
