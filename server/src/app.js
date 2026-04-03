import express from "express";
import cors from "cors";

const app = express();

// Body parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(";")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
import authRoute from "./routes/auth.routes.js"
app.use("/auth",authRoute);

import busRouter from "./routes/bus.route.js";
app.use("/buses", busRouter);

import routeRouter from "./routes/route.route.js";
app.use("/routes", routeRouter);

import scheduleRoutes from "./routes/schedule.route.js";
app.use("/schedules", scheduleRoutes);
import driverRoutes from "./routes/driver.route.js";
app.use("/drivers", driverRoutes);






// Health check route (very useful)
app.get("/", (req, res) => {
  res.send("Trackify API is running 🚍");
});


export default app;