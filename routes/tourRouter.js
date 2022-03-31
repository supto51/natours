const express = require("express");
const tourController = require("./../controller/tourController");
const authController = require("./../controller/authController");
const router = express.Router();
const reviewRouter = require("./../routes/reviewRouter");

// router
//   .route("/:tourId/reviews")
//   .post(authController.protect, authController.restrictTo("user"), reviewController.createReview);

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliceTopCheap, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithIn);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(authController.protect, tourController.updatingTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
