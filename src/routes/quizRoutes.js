const express = require("express");
const router = express.Router();

const conceptGraph = require("../data/conceptGraph.json");
const questionBank = require("../data/questionBank.json");

router.get("/", (req, res) => {
  try {
    res.status(200).json({
      graph: conceptGraph,
      questions: questionBank,
    });
  } catch (error) {
    console.error("Error serving quiz data:", error);
    res.status(500).json({ error: "Failed to fetch quiz data" });
  }
});

module.exports = router;
