import express from "express";

import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} from "../controllers/schedule.controller.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create schedule → Admin only
router.post("/", protect, authorize("admin"), createSchedule);

// Get all schedules → Logged-in users
router.get("/", protect, getAllSchedules);

// Get single schedule → Logged-in users
router.get("/:id", protect, getScheduleById);

// Update schedule → Admin only
router.put("/:id", protect, authorize("admin"), updateSchedule);

// Delete schedule → Admin only
router.delete("/:id", protect, authorize("admin"), deleteSchedule);