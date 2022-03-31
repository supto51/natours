const mongoose = require("mongoose");
const Tour = require("./tourModels");

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a Tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a User"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ReviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

ReviewSchema.statics.calculateAverage = async function (tourId) {
  const states = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: { _id: "$tour", nRating: { $sum: 1 }, avgRating: { $avg: "$rating" } },
    },
  ]);

  if (states.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: states[0].avgRating,
      ratingsQuantity: states[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

ReviewSchema.post("save", function () {
  this.constructor.calculateAverage(this.tour);
});

// ReviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();

//   next();
// });

// ReviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calculateAverage(this.r.tour);
// });

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
