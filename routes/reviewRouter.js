const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("./../controller/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
