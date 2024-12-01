import mongoose from "mongoose";
const expeneSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    date: {
      type: Date
    },
  },
  { timestamps: true }
);

export default mongoose.model("expenses", expeneSchema);
