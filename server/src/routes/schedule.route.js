import express from "express";

import {
  createSchedule,
  getAllSchedules,
  deleteSchedule,
  getAvailable,
  updateSchedule,
  searchSchedules,
} from "../controllers/schedule.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/search", searchSchedules);

/* IMPORTANT (FIRST) */
router.get("/available", protect, getAvailable);

/* CRUD */
router.post("/", protect, authorize("admin"), createSchedule);
router.get("/", protect, getAllSchedules);
router.put("/:id", protect, authorize("admin"), updateSchedule);
router.delete("/:id", protect, authorize("admin"), deleteSchedule);

export default router;
