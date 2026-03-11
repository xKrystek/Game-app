require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.log(`Error occured: ${error}`));
