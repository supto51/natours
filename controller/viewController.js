const Tour = require("../models/tourModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  if (!tours) {
    return next(new AppError("No Tours Found", 404));
  }

  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("No tour found!", 404));
  }

  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
});

exports.account = catchAsync(async (req, res, next) => {
  res.status(200).render("account", {
    title: "Account",
  });
});
