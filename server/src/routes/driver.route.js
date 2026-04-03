import express from "express";
import {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
} from "../controllers/driver.controller.js";
import { protect, } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/add", protect, authorize("admin"),createDriver);
router.get("/",protect, getDrivers);
router.put("/:id", protect,updateDriver);
router.delete("/:id",protect, authorize("admin"), deleteDriver);

export default router;