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
  : ["http://localhost:4000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
import busRouter from "./routes/bus.route.js";

app.use("/api/v1/buses", busRouter);

import routeRouter from "./routes/route.route.js";

app.use("/api/v1/routes", routeRouter);

// Health check route (very useful)
app.get("/", (req, res) => {
  res.send("Trackify API is running 🚍");
});


export default app;