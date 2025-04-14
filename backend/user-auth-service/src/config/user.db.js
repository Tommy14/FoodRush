import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

let dbConnection = null;

const connectDB = async () => {
  if (dbConnection) {
    console.log("MongoDB connection already established.");
    return dbConnection;
  }
  try {
    dbConnection = await mongoose.connect(process.env.MONGO_URI_USER_SERVICE);
    console.log(`MongoDB Connected: ${dbConnection.connection.db.databaseName}`);
    return dbConnection;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;