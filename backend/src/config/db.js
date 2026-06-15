const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/genova";
  
  // Set a short connection timeout so we don't hang forever
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  
  console.log("MongoDB Connected");
};

module.exports = connectDB;