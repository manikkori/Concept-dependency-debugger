const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Load the static JSON data
const conceptGraph = require('./data/conceptGraph.json');
const questionBank = require('./data/questionBank.json');

// Import the new diagnosis route
const diagnoseRoutes = require('./routes/diagnoseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Route to fetch quiz data (Phase 1)
app.get('/api/quiz', (req, res) => {
  try {
    res.status(200).json({
      graph: conceptGraph,
      questions: questionBank
    });
  } catch (error) {
    console.error("Error serving quiz data:", error);
    res.status(500).json({ error: "Failed to fetch quiz data" });
  }
});

// Use the Diagnosis Route (Phase 3)
app.use('/api/diagnose', diagnoseRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Concept Dependency Debugger API is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});