import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    numberPlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "On Trip"],
      default: "inactive",
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
  },

  { timestamps: true },
);

export const Bus = mongoose.model("Bus", busSchema);
