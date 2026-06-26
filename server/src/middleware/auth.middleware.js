import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Driver } from "../models/driver.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "No token found, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "driver") {
      const driver = await Driver.findById(decoded.id).select("-password");
      if (!driver) {
        return res.status(401).json({ msg: "Driver not found" });
      }
      req.user = { ...driver.toObject(), role: "driver" };
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Token" });
  }
};
