const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB, {});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log("App is running...");
});

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  console.log("Unhandled rejection. Shutting  Down...");
  server.close(() => {
    process.exit(1);
  });
});
