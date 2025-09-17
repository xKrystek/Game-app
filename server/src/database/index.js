const mongoose = require("mongoose");

const db = mongoose
  .connect("mongodb://localhost:27017/tic-tac-toe")
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.log(`Error occured: ${error}`));

module.exports = db;