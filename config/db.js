const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected 🚀");
  } catch (error) {
    console.error("DB connection failed ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;
