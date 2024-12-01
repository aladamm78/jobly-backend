"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");

const morgan = require("morgan");

const app = express();

// Log incoming requests (useful for debugging during development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Enable CORS for requests from the frontend
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from the frontend
}));

app.use(express.json()); // Parse incoming JSON data
app.use(morgan("tiny")); // Log requests for debugging
app.use(authenticateJWT); // Authenticate incoming JWTs

// Define routes
app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);

// Handle 404 errors for undefined routes
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// Generic error handler
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

// Quick route to test if server is running
app.get("/", (req, res) => {
  res.send("Server is working!");
});

module.exports = app;
