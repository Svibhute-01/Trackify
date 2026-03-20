import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateJWTtoken from "../config/jwt.js";


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 4. Generate token
    const token = generateJWTtoken(user);

    // 5. Send response
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

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. Generate token
    const token = generateJWTtoken(user);

    // 4. Send response
    res.json({
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


// ================= GET CURRENT USER =================
export const getMe = async (req, res) => {
  try {
    // req.user comes from protect middleware
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};