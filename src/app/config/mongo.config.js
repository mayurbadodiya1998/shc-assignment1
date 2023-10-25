const mongoose = require("mongoose");

// Define the MongoDB connection string
const dbURI = process.env.MONGO_URI;

// Create a function to establish the database connection
function connectDB() {
  mongoose.connect(dbURI);

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  db.once("open", () => {
    console.log("Connected to MongoDB");
  });

  // Return the Mongoose connection instance
  return db;
}

// Export the connectDB function to use in other files
module.exports = connectDB;
