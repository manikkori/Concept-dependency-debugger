const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const quizRoutes = require("./routes/quizRoutes");
const diagnoseRoutes = require("./routes/diagnoseRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/quiz", quizRoutes);
app.use("/api/diagnose", diagnoseRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Concept Dependency Debugger API is running! 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
