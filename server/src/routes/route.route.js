import express from "express";
import {
  addRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} from "../controllers/route.controller.js";

import { protect} from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();
router.post("/add", protect, authorize("admin"), addRoute);

router.get("/", protect, getAllRoutes);

router.get("/:id", protect, getRouteById);

router.put("/:id", protect, authorize("admin"), updateRoute);

router.delete("/:id", protect, authorize("admin"), deleteRoute);
export default router;