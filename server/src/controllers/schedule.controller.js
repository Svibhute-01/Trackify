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
      status: req.body.status || "scheduled",
    });

    const populated = await Schedule.findById(schedule._id)
      .populate("bus")
      .populate("route")
      .populate("driver");

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { bus, driver, route, date, departureTime, arrivalTime, status } =
      req.body;

    const existing = await Schedule.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found" });
    }

    const depTime = combineDateTime(date, departureTime);
    const arrTime = combineDateTime(date, arrivalTime);

    if (arrTime <= depTime) {
      return res.status(400).json({
        success: false,
        message: "Arrival must be after departure",
      });
    }

    const conflict = await Schedule.findOne({
      _id: { $ne: id },
      $or: [{ bus }, { driver }],
      departureTime: { $lt: arrTime },
      arrivalTime: { $gt: depTime },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Bus/Driver already booked for this time slot",
      });
    }

    existing.bus = bus;
    existing.driver = driver;
    existing.route = route;
    existing.date = date;
    existing.departureTime = depTime;
    existing.arrivalTime = arrTime;
    if (status) existing.status = status;
    await existing.save();

    const populated = await Schedule.findById(id)
      .populate("bus")
      .populate("route")
      .populate("driver");

    res.json({ success: true, data: populated });
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

/* ---------------- PUBLIC SEARCH ---------------- */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchSchedules = async (req, res) => {
  try {
    const from = (req.query.from || "").trim();
    const to = (req.query.to || "").trim();

    if (!from && !to) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one of 'from' or 'to'",
      });
    }

    const routeFilter = {};
    if (from) routeFilter.from = { $regex: escapeRegex(from), $options: "i" };
    if (to) routeFilter.to = { $regex: escapeRegex(to), $options: "i" };

    const matchingRoutes = await Route.find(routeFilter).select("_id");
    if (matchingRoutes.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Today + upcoming, scheduled or running only
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const schedules = await Schedule.find({
      route: { $in: matchingRoutes.map((r) => r._id) },
      departureTime: { $gte: startOfToday },
      status: { $in: ["scheduled", "running"] },
    })
      .populate("bus", "numberPlate capacity")
      .populate("route", "routeName routeCode from to distance duration stops")
      .populate("driver", "name")
      .sort({ departureTime: 1 });

    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- AVAILABLE ---------------- */
export const getAvailable = async (req, res) => {
  try {
    const { date, departureTime, arrivalTime, excludeId } = req.query;

    if (!date || !departureTime || !arrivalTime) {
      return res.status(400).json({
        success: false,
        message: "Missing params",
      });
    }

    const depTime = combineDateTime(date, departureTime);
    const arrTime = combineDateTime(date, arrivalTime);

    const conflictQuery = {
      departureTime: { $lt: arrTime },
      arrivalTime: { $gt: depTime },
    };
    if (excludeId) conflictQuery._id = { $ne: excludeId };

    const conflicts = await Schedule.find(conflictQuery);

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