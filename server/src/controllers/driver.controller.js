import { Driver } from "../models/driver.model.js";
import bcrypt from "bcryptjs";

// ================= CREATE DRIVER (ADMIN) =================
export const createDriver = async (req, res) => {
  try {
    const { name, email, password, contact, license, status } = req.body;

    // check if driver exists
    const exists = await Driver.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Driver already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create driver
    const driver = await Driver.create({
      name,
      email,
      password: hashedPassword,
      role: "driver", // 🔥 important
      contact,
      license,
      status,
    });

    res.status(201).json({
      msg: "Driver created successfully",
      driver: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        contact: driver.contact,
        license: driver.license,
        status: driver.status,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= GET ALL DRIVERS =================
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select("-password");
    res.json(drivers);

  } catch (error) {
    res.status(500).json({ msg: "Error fetching drivers" });
  }
};


// ================= UPDATE DRIVER =================
export const updateDriver = async (req, res) => {
  try {
    const { password } = req.body;

    // hash password if updated
    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, role: "driver" },
      req.body,
      { new: true }
    ).select("-password");

    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    res.json({
      msg: "Driver updated successfully",
      driver,
    });

  } catch (error) {
    res.status(500).json({ msg: "Update failed" });
  }
};


// ================= DELETE DRIVER =================
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({
      _id: req.params.id,
      role: "driver",
    });

    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    res.json({ msg: "Driver deleted successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Delete failed" });
  }
};