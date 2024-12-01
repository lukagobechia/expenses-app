import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Connected to database")
  } catch (e) {
    console.log("Could not connect to aatabase")
    process.exit(1)
  }
};

export default connectDB