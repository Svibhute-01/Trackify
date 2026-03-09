import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },

    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    departureTime: {
      type: Date,
      required: true
    },

    arrivalTime: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["scheduled", "running", "completed", "cancelled"],
      default: "scheduled"
    }

  },
  { timestamps: true }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);