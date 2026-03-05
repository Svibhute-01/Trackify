import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      trim: true
    },

    to: {
      type: String,
      required: true,
      trim: true
    },

    stops: [
      {
        type: String,
        trim: true
      }
    ],

    distance: {
      type: Number,
      required: true
    },

    duration: {
      type: Number, // in minutes
      required: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);