const AppError = require("./../utils/appError");

const handelCastErrorDB = (err) => {
  const message = `Invalid ${err.name}: ${err.value}`;

  return new AppError(message, 400);
};

const handelDuplicateFieldDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value} Please select another value`;
  return new AppError(message, 400);
};

const handelValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;

  return new AppError(message, 4000);
};

const errorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorForProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error", err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong",
    });
  }
};

const handelJWTError = (err) => new AppError("Invalid Token! Please, provide a valid token", 401);
const handelTokenExpireError = (err) =>
  new AppError("Token Expired! Please, provide a new token!", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    errorForDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CaseError") error = handelCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateFieldDB(error);
    if (error.name === "ValidationError") error = handelValidationError(error);
    errorForProd(err, res);
    if (error.name === "JsonWebTokenError") error = handelJWTError(error);
    if (error.name === "TokenExpiredError") error = handelTokenExpireError(error);
  }

  next();
};
