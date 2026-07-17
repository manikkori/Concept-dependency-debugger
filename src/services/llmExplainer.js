// backend/src/services/llmExplainer.js
const OpenAI = require("openai");

// Pointing the standard OpenAI client to Groq's API endpoint
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function getExplanation(scores, rootWeakConceptId, conceptGraph) {
  try {
    const prompt = `
      You are an expert, encouraging tutor.
      Here is the concept dependency chain: ${JSON.stringify(conceptGraph)}
      Here is the student's performance: ${JSON.stringify(scores)}
      The root weak concept identified is: ${rootWeakConceptId}

      Write a 3-sentence explanation:
      1. What their actual weak point is (the root cause).
      2. Why this is causing downstream failures.
      3. One actionable next step.

      Respond ONLY with this JSON structure:
      {
        "diagnosis": "...",
        "whyItMatters": "...",
        "nextStep": "..."
      }
    `;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // Tere dashboard ke hisaab se exact model
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
    return {
      diagnosis: "Could not generate diagnosis.",
      whyItMatters: "System error.",
      nextStep: "Review your basic algebra.",
    };
  }
}

module.exports = { getExplanation };
