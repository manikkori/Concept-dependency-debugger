const express = require("express");
const router = express.Router();
const { analyzePerformance } = require("../services/propagationEngine");
const { getExplanation } = require("../services/llmExplainer");

const conceptGraph = require("../data/conceptGraph.json");
const questionBank = require("../data/questionBank.json");

router.post("/", async (req, res) => {
  try {
    const { answers } = req.body; // Expecting [{ questionId: 'q1', selected: '...' }]

    // 1. Run Propagation Engine
    const { scores, rootWeakConceptId } = analyzePerformance(
      answers,
      conceptGraph,
      questionBank,
    );

    // 2. Run LLM Explanation
    const explanation = await getExplanation(
      scores,
      rootWeakConceptId,
      conceptGraph,
    );

    // 3. Send back unified response
    res.json({
      scores,
      rootWeakConceptId,
      ...explanation,
    });
  } catch (error) {
    console.error("Diagnosis Route Error:", error);
    res.status(500).json({ error: "Diagnosis failed" });
  }
});

module.exports = router;
