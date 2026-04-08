import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver", // ✅ FIXED
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    departureTime: {
      type: Date,
      required: true,
    },

    arrivalTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "running", "completed", "cancelled"],
      default: "scheduled",
    },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true },
);

/* 🔥 INDEXES */
scheduleSchema.index({ bus: 1, departureTime: 1 });
scheduleSchema.index({ driver: 1, departureTime: 1 });

export const Schedule = mongoose.model("Schedule", scheduleSchema);
