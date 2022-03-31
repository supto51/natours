const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");

const globalErrorController = require("./controller/errorController");

const tourRouter = require("./routes/tourRouter");
const usersRouter = require("./routes/usersRouter");
const reviewRouter = require("./routes/reviewRouter");
const viewRouter = require("./routes/viewRoute");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(helmet());
// script(src="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js")
// script(src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.min.js")
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "connect-src": ["'self'", "http://127.0.0.1:8000/"],
      "script-src": [
        "'self'",
        "https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js",
        "https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css",
      ],
    },
  })
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json());

app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(xssClean());
app.use(compression());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: `Can't find ${req.originalUrl} on the sever!`,
  });

  next();
});

app.use(globalErrorController);

module.exports = app;
