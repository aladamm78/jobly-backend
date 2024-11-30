"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors");
const { PORT } = require("./config");

// Import backend routes
const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Mount backend API routes
app.use("/auth", authRoutes);
app.use("/jobs", jobsRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);

// Error handling for unmatched API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    const err = new Error("API route not found");
    err.status = 404;
    return next(err);
  }
  next();
});

// Serve React build files (frontend)
app.use(express.static(path.join(__dirname, "..", "jobly-frontend", "build")));

// Serve React app for all unmatched routes (catch-all handler)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "jobly-frontend", "build", "index.html"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      status,
    },
  });
});

// Start the server
app.listen(PORT, function () {
  console.log(`Server started on http://localhost:${PORT}`);
});
