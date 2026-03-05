import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    numberPlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    status: {
      type: String,
      enum: ["active", "inactive", "on_trip"],
      default: "inactive"
    }
  },
  { timestamps: true }
);

export const Bus = mongoose.model("Bus", busSchema);