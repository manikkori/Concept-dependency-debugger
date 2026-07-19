const express = require("express");
const router = express.Router();
const { analyzePerformance } = require("../services/propagationEngine");
const { getExplanation } = require("../services/llmExplainer");

const loadData = (graphFile, bankFile) => {
  try {
    return {
      graph: require(`../data/${graphFile}`),
      questions: require(`../data/${bankFile}`),
    };
  } catch (error) {
    return {
      graph: require("../data/conceptGraph.json"),
      questions: require("../data/questionBank.json"),
    };
  }
};

const dataStore = {
  "Discrete Math": loadData("conceptGraph.json", "questionBank.json"),
  "Computer Networks": loadData("networksGraph.json", "networksBank.json"),
  DBMS: loadData("dbmsGraph.json", "dbmsBank.json"),
  "Data Structures": loadData("dsGraph.json", "dsBank.json"),
  "OOP Concepts": loadData("oopGraph.json", "oopBank.json"),
  "Web Dev Basics": loadData("webDevGraph.json", "webDevBank.json"),
};

router.post("/", async (req, res) => {
  try {
    const { answers, subject } = req.body;
    const currentSubject = subject || "Discrete Math";
    const subjectData = dataStore[currentSubject] || dataStore["Discrete Math"];

    const { scores, rootWeakConceptId, allMastered } = analyzePerformance(
      answers,
      subjectData.graph,
      subjectData.questions,
    );

    const explanation = await getExplanation(
      scores,
      rootWeakConceptId,
      allMastered,
      subjectData.graph,
      currentSubject,
    );

    res.json({
      scores,
      allMastered,
      ...(allMastered ? {} : { rootWeakConceptId }),
      ...explanation,
    });
  } catch (error) {
    console.error("Diagnosis Route Error:", error);
    res.status(500).json({ error: "Diagnosis failed" });
  }
});

module.exports = router;
