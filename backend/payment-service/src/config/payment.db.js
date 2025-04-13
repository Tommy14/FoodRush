import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

let dbConnection = null;

const connectDB = async () => {
  if (dbConnection) {
    console.log("MongoDB already connected for Payment Service.");
    return dbConnection;
  }

  try {
    dbConnection = await mongoose.connect(process.env.MONGO_URI_PAYMENT_SERVICE);
    console.log(`Payment DB Connected: ${dbConnection.connection.db.databaseName}`);
    return dbConnection;
  } catch (error) {
    console.error("MongoDB Connection Error (Payment):", error.message);
    process.exit(1);
  }
};

export default connectDB;
