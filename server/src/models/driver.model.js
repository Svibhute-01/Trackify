import mongoose from"mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    license: {
      type: String,
      required: true,
      unique: true,
    },

    contact: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "On Trip", "Off Duty"],
      default: "Available",
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const Driver = mongoose.model("Driver", driverSchema);