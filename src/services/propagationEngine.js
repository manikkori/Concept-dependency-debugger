const THRESHOLD_WEAK = 0.6;
const THRESHOLD_STRONG = 0.8;

function getStatus(adjustedScore) {
  if (adjustedScore >= THRESHOLD_STRONG) return "strong";
  if (adjustedScore >= THRESHOLD_WEAK) return "borderline";
  return "weak";
}

function analyzePerformance(studentAnswers, conceptGraph, questionBank) {
  const concepts = conceptGraph.concepts;
  const questions = questionBank.questions;

  // 1. Calculate Raw Scores
  const conceptStats = {};

  // Initialize stats for each concept
  concepts.forEach((c) => {
    conceptStats[c.id] = { total: 0, correct: 0, rawScore: 0 };
  });

  // Grade the student's answers
  studentAnswers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const conceptId = question.conceptId;
    conceptStats[conceptId].total += 1;

    // Check if the answer is exactly correct
    if (question.correctAnswer === answer.selected) {
      conceptStats[conceptId].correct += 1;
    }
  });

  // Compute raw scores (0.0 to 1.0)
  concepts.forEach((c) => {
    const stats = conceptStats[c.id];
    stats.rawScore = stats.total > 0 ? stats.correct / stats.total : 0;
  });

  // 2. Propagate Scores (Blame Assignment)
  // Note: The conceptGraph JSON is ordered prerequisites-first (topological order).
  const results = {};
  let rootWeakConceptId = null;

  concepts.forEach((concept) => {
    let rawScore = conceptStats[concept.id].rawScore;
    let adjustedScore = rawScore;

    // Check prerequisites to see if we need to cap the downstream score
    if (concept.prerequisites && concept.prerequisites.length > 0) {
      let lowestPrereqScore = 1.0;

      concept.prerequisites.forEach((prereqId) => {
        if (
          results[prereqId] &&
          results[prereqId].adjusted < lowestPrereqScore
        ) {
          lowestPrereqScore = results[prereqId].adjusted;
        }
      });

      // If the foundation (prerequisite) is weak, don't trust a lucky downstream pass.
      // Cap the current adjusted score at the lowest prerequisite's score.
      if (lowestPrereqScore < THRESHOLD_WEAK) {
        adjustedScore = Math.min(rawScore, lowestPrereqScore);
      }
    }

    // Determine the color/status for the graph UI
    // Scores from 0.60 through 0.79 are a distinct, borderline tier.
    const status = getStatus(adjustedScore);

    results[concept.id] = {
      raw: rawScore,
      adjusted: adjustedScore,
      status: status,
    };

    // 3. Identify Root Weak Concept
    // Since we are iterating from foundational concepts to advanced concepts,
    // the FIRST weak concept we find is the true root cause.
    if (status === "weak" && !rootWeakConceptId) {
      rootWeakConceptId = concept.id;
    }
  });

  // Fallback: If they passed everything perfectly, return the highest concept
  if (!rootWeakConceptId) {
    rootWeakConceptId = "None - All concepts mastered!";
  }

  return {
    scores: results,
    rootWeakConceptId: rootWeakConceptId,
  };
}

module.exports = { analyzePerformance };
