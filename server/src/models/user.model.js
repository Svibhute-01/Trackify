import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["admin", "driver", "user"],
      default: "user"
    },

    mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"]
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
