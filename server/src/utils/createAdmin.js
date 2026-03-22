import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("✅ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      username: "admin", // ✅ add this
      mobile: "9999999999", // ✅ add this
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("🚀 Default Admin Created");
    console.log("📧 Email: admin@gmail.com");
    console.log("🔑 Password: admin123");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};
