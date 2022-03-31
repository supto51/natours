const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour name is required!"],
      unique: true,
      trim: true,
      maxlength: [100, "Tour name only have 100 characters"],
      minlength: [10, "Tour name must have minimum 10 character"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "Tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have maxGroupSize"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour must  have difficulty"],
      enum: {
        values: ["easy", "difficult", "medium"],
        message: "Tour only have easy or difficult or medium difficulty",
      },
    },
    price: {
      type: Number,
      required: [true, "Tour price required!"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Tour rating start at 0"],
      max: [5, "Tour rating count upto 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.name;
        },
        message: "Tour Discount Price Must be less the price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "Image must have a Cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TourSchema.index({ price: 1, ratingsAverage: -1 });
TourSchema.index({ slug: 1 });
TourSchema.index({ startLocation: "2dsphere" });

TourSchema.virtual("durationWeak").get(function () {
  return this.duration / 7;
});

TourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

TourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

TourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

TourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v  -passwordChangedAt",
  });

  next();
});

// TourSchema.pre("save", async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);

//   next();
// });

// TourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } },
//   });
//   next();
// });

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
