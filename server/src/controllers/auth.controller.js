import { User } from "../models/user.model.js";
import { Driver } from "../models/driver.model.js";
import bcrypt from "bcryptjs";
import generateJWTtoken from "../config/jwt.config.js";


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = generateJWTtoken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Try User model first (admin/public)
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = generateJWTtoken(user);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        user: { role: user.role, name: user.name, id: user._id }
      });
    }

    // 2. Try Driver model
    const driver = await Driver.findOne({ email });
    if (driver) {
      const isMatch = await bcrypt.compare(password, driver.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Generate token with role: "driver"
      const token = generateJWTtoken({ _id: driver._id, role: "driver" });
      return res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        role: "driver",
        driverId: driver._id,
        token,
        user: { role: "driver", name: driver.name, id: driver._id, driverId: driver._id }
      });
    }

    return res.status(400).json({ message: "Invalid credentials" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= GET CURRENT USER =================
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
