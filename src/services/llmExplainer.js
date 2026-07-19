const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function getExplanation(
  scores,
  rootWeakConceptId,
  allMastered,
  conceptGraph,
  subject,
) {
  try {
    const masteryInstructions = allMastered
      ? `
      The student has mastered every assessed concept. Write a celebratory 3-sentence summary:
      1. Praise their strong foundation across the dependency chain.
      2. Explain why this foundation prepares them for more advanced work.
      3. Recommend one or two specific next-level ${subject} topics or applications to explore.
      Do not say that there is no weak point and do not frame this as a warning.
      `
      : `
      The root weak concept identified is: ${rootWeakConceptId}

      Write a 3-sentence explanation:
      1. What their actual weak point is (the root cause).
      2. Why this is causing downstream failures.
      3. One actionable next step.
      `;

    const prompt = `
      You are an expert, encouraging ${subject} tutor.
      Here is the concept dependency chain: ${JSON.stringify(conceptGraph)}
      Here is the student's performance: ${JSON.stringify(scores)}
      ${masteryInstructions}

      Respond ONLY with this JSON structure:
      {
        "diagnosis": "...",
        "whyItMatters": "...",
        "nextStep": "..."
      }
    `;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful education assistant. Respond only in JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Groq LLM Service Error:", error);
    if (allMastered) {
      return {
        diagnosis:
          "Excellent work - you demonstrated a strong foundation across every assessed concept.",
        whyItMatters:
          "Reliable fundamentals make it easier to connect ideas and solve more complex problems with confidence.",
        nextStep: `Build on this by exploring advanced ${subject} applications and integrated practice problems.`,
      };
    }
    return {
      diagnosis: "Could not generate diagnosis.",
      whyItMatters: "System error.",
      nextStep: "Review your basics.",
    };
  }
}

module.exports = { getExplanation };
