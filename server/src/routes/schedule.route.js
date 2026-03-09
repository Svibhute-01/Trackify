import express from "express";

import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} from "../controllers/schedule.controller.js";

const router = express.Router();


// Create schedule
router.post("/", createSchedule);


// Get all schedules
router.get("/", getAllSchedules);


// Get single schedule
router.get("/:id", getScheduleById);


// Update schedule
router.put("/:id", updateSchedule);


// Delete schedule
router.delete("/:id", deleteSchedule);


export default router;