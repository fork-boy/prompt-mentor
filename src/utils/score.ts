/**
 * Score calculation utilities
 */

export interface ScoreResult {
  score: number;
  feedback: string;
}

/**
 * Calculate the quality score of a prompt
 * @param prompt - The prompt text to score
 * @returns Score result with score and feedback
 */
export function calculatePromptScore(prompt: string): ScoreResult {
  let score = 0;
  const feedback: string[] = [];

  if (!prompt || prompt.trim().length === 0) {
    return { score: 0, feedback: "Prompt is empty" };
  }

  // Length check (15-100 words is ideal)
  const wordCount = prompt.trim().split(/\s+/).length;
  if (wordCount >= 15 && wordCount <= 100) {
    score += 20;
  } else if (wordCount >= 10 && wordCount <= 150) {
    score += 10;
  } else {
    feedback.push(
      `Prompt length is ${wordCount} words. Ideal range: 15-100 words.`,
    );
  }

  // Clarity check
  if (prompt.includes("?") || prompt.includes(":")) {
    score += 20;
  } else {
    feedback.push(
      "Prompt could be more specific with clear questions or directives.",
    );
  }

  // Context check
  if (prompt.length > 50) {
    score += 20;
  } else {
    feedback.push("Prompt could include more context.");
  }

  // Specificity check
  const specificKeywords = [
    "specific",
    "detail",
    "example",
    "explain",
    "describe",
    "analyze",
    "compare",
    "contrast",
    "summarize",
  ];
  if (
    specificKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))
  ) {
    score += 20;
  } else {
    feedback.push("Consider adding more specific instructions or keywords.");
  }

  // Structure check
  if (prompt.split(".").length > 1 || prompt.split(";").length > 1) {
    score += 20;
  } else {
    feedback.push(
      "Consider structuring your prompt with multiple sentences or clauses.",
    );
  }

  return {
    score: Math.min(100, score),
    feedback:
      feedback.length > 0 ? feedback.join(" ") : "Prompt is well-structured!",
  };
}
