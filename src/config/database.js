const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const uri = process.env.MONGO_DB_KEY;
  if (!uri) {
    throw new Error("MONGO_DB_KEY is not defined");
  }
  await mongoose.connect(uri);
};

module.exports = {
  connectDB,
};
