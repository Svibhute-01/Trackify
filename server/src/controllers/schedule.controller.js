import { Schedule } from "../models/schedule.model.js";
import { Bus } from "../models/bus.model.js";
import { Driver } from "../models/driver.model.js";
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

/* ---------------- DRIVER: GET MY SCHEDULES ---------------- */
export const getDriverSchedules = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    const schedules = await Schedule.find({ driver: driverId })
      .populate("bus")
      .populate("route")
      .populate("driver")
      .sort({ departureTime: 1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTrips = schedules.filter((s) => {
      const dep = new Date(s.departureTime);
      return dep >= today && dep < tomorrow;
    });

    const upcoming = schedules.filter((s) => {
      const dep = new Date(s.departureTime);
      return dep >= tomorrow && s.status === "scheduled";
    });

    const completed = schedules.filter((s) => s.status === "completed");

    res.json({
      success: true,
      data: { all: schedules, today: todayTrips, upcoming, completed },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- DRIVER: UPDATE TRIP STATUS ---------------- */
export const updateTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const schedule = await Schedule.findById(id).populate("bus").populate("route").populate("driver");
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    // Only the assigned driver or admin can update
    const requesterId = req.user._id.toString();
    const driverId = schedule.driver._id
      ? schedule.driver._id.toString()
      : schedule.driver.toString();

    if (req.user.role !== "admin" && requesterId !== driverId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Validate transitions
    const allowed = {
      scheduled: ["running", "cancelled"],
      running: ["completed", "cancelled"],
    };

    if (!allowed[schedule.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from '${schedule.status}' to '${status}'`,
      });
    }

    // Business rule: only one trip can be running per bus at a time
    if (status === "running") {
      const alreadyRunning = await Schedule.findOne({
        _id: { $ne: id },
        bus: schedule.bus._id,
        status: "running",
      });
      if (alreadyRunning) {
        return res.status(400).json({
          success: false,
          message: "Another trip for this bus is already running",
        });
      }
    }

    schedule.status = status;
    await schedule.save();

    const updated = await Schedule.findById(id)
      .populate("bus")
      .populate("route")
      .populate("driver");

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
