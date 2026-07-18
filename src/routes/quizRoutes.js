const express = require("express");
const router = express.Router();

// Safe loader: Agar file nahi mili, toh crash nahi hoga, default Math return karega
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
};

router.get("/", (req, res) => {
  try {
    const subject = req.query.subject || "Discrete Math";
    const subjectData = dataStore[subject] || dataStore["Discrete Math"];

    res.status(200).json({
      graph: subjectData.graph,
      questions: subjectData.questions,
    });
  } catch (error) {
    console.error("Error serving quiz data:", error);
    res.status(500).json({ error: "Failed to fetch quiz data" });
  }
});

module.exports = router;
