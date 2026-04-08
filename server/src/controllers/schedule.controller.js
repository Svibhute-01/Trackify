import { Schedule } from "../models/schedule.model.js";
import { Bus } from "../models/bus.model.js";
import { Driver } from "../models/driver.model.js"; // ✅ IMPORTANT
import { Route } from "../models/route.model.js";

/* 🔧 helper */
const combineDateTime = (date, time) => {
  return new Date(`${date}T${time}`);
};

/* ---------------- CREATE ---------------- */
export const createSchedule = async (req, res) => {
  try {
    const { bus, driver, route, date, departureTime, arrivalTime } = req.body;

    const depTime = combineDateTime(date, departureTime);
    const arrTime = combineDateTime(date, arrivalTime);

    if (arrTime <= depTime) {
      return res.status(400).json({
        success: false,
        message: "Arrival must be after departure",
      });
    }

    const conflict = await Schedule.findOne({
      $or: [{ bus }, { driver }],
      departureTime: { $lt: arrTime },
      arrivalTime: { $gt: depTime },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Bus/Driver already booked",
      });
    }

    const schedule = await Schedule.create({
      bus,
      driver,
      route,
      date,
      departureTime: depTime,
      arrivalTime: arrTime,
    });

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- GET ALL ---------------- */
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("bus")
      .populate("route")
      .populate("driver")
      .sort({ departureTime: 1 });

    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* ---------------- AVAILABLE ---------------- */
export const getAvailable = async (req, res) => {
  try {
    const { date, departureTime, arrivalTime } = req.query;

    if (!date || !departureTime || !arrivalTime) {
      return res.status(400).json({
        success: false,
        message: "Missing params",
      });
    }

    const depTime = combineDateTime(date, departureTime);
    const arrTime = combineDateTime(date, arrivalTime);

    const conflicts = await Schedule.find({
      departureTime: { $lt: arrTime },
      arrivalTime: { $gt: depTime },
    });

    const busyBusIds = conflicts.map((c) => c.bus);
    const busyDriverIds = conflicts.map((c) => c.driver);

    const buses = await Bus.find({
      _id: { $nin: busyBusIds },
      status: "Active",
    });

    const drivers = await Driver.find({
      _id: { $nin: busyDriverIds },
      status: "Available",
    });

    const routes = await Route.find({
      status: "Active",
    });

    res.json({
      success: true,
      data: { buses, drivers, routes },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};