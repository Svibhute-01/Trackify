import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
    // Future ready (optional)
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
    },

    routeCode: {
      type: String,
      required: true,
      unique: true, // IMPORTANT
      uppercase: true,
      trim: true,
    },

    from: {
      type: String,
      required: true,
      trim: true,
    },

    to: {
      type: String,
      required: true,
      trim: true,
    },

    stops: [stopSchema],

    distance: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number, // minutes
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"], // match frontend
      default: "Active",
    },

    // Future scaling
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);