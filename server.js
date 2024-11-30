"use strict";

const express = require("express");
const app = require("./app");
const path = require("path");
const { PORT } = require("./config");

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "src", "build")));

// Serve React app for any unmatched route
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next(); // Skip API routes
  res.sendFile(path.join(__dirname, "src", "build", "index.html"));
});

// Start the server
app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
