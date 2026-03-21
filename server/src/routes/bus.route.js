import express from "express";
import { addBus, getAllBuses, getBusById, updateBus, deleteBus } from "../controllers/bus.controller.js";
import { protect, } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/add", protect, authorize("admin"), addBus);

router.get("/", protect, getAllBuses);

router.get("/:id", protect, getBusById);

router.put("/:id", protect, authorize("admin"), updateBus);

router.delete("/:id", protect, authorize("admin"), deleteBus);
export default router;