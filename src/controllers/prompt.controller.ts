import { Request, Response } from "express";
import { analyzerService } from "../services/analyzer.service";
import { improverService } from "../services/improver.service";
import { normalizeWhitespace } from "../utils/textNormalizer";

/**
 * Prompt Controller - Handles prompt-related requests
 */

export class PromptController {
  /**
   * Build a system prompt for improving user prompts
   */
  private buildSystemPrompt(analysis: any): string {
    const {
      score,
      feedback,
      analysis: detailedAnalysis,
      characteristics,
    } = analysis;

    return `You are an expert prompt engineer. Your ONLY job is to rewrite and improve prompts, NOT to answer them.

CRITICAL RULES:
1. NEVER answer the user's prompt or provide the requested content
2. ONLY rewrite the prompt to make it better for AI interactions
3. If the user asks a question, improve it into a better question
4. If the user gives a command, improve it into a clearer command

EXAMPLES:

User Input: "improve my resume"
❌ WRONG: [Provides resume tips or rewrites their resume]
✅ CORRECT: "Please review my resume and provide specific suggestions for improvement in the following areas: formatting, content clarity, achievement quantification, and keyword optimization for ATS systems. Focus on making my experience more impactful and results-oriented."

User Input: "what is machine learning"
❌ WRONG: [Explains what machine learning is]
✅ CORRECT: "What is machine learning? Please provide a comprehensive explanation that includes: the fundamental concept, key types (supervised, unsupervised, reinforcement learning), real-world applications, and how it differs from traditional programming. Use simple language with practical examples."

User Input: "write a python script"
❌ WRONG: [Writes a Python script]
✅ CORRECT: "Write a Python script that [specify purpose]. Requirements: use Python 3.x, include error handling, add comments explaining key logic, follow PEP 8 style guidelines, and provide example usage."

User Input: "how do i learn react"
❌ WRONG: [Provides learning resources]
✅ CORRECT: "How can I effectively learn React as a beginner? Please provide a structured learning path that includes: prerequisite knowledge needed, recommended resources (official docs, tutorials, courses), hands-on project ideas for practice, common pitfalls to avoid, and estimated timeline for each learning phase."

IMPROVEMENT GUIDELINES:
1. Add specificity - Replace vague terms with concrete details
2. Define scope - Specify what should/shouldn't be included
3. Set format expectations - Mention desired output structure
4. Provide context - Add background information when relevant
5. Use role framing - Start with "Act as a [role]" when helpful
6. Include examples - Add "For example..." when it clarifies intent
7. Add constraints - Specify tone, length, complexity level
8. Make it actionable - Use clear directives and questions

CURRENT PROMPT ANALYSIS:
- Score: ${score}/100
- Feedback: ${feedback}
${
  characteristics
    ? `
- Has Role Definition: ${characteristics.hasRole ? "Yes" : "No"}
- Has Constraints: ${characteristics.hasConstraints ? "Yes" : "No"}  
- Has Examples: ${characteristics.hasExamples ? "Yes" : "No"}
- Length: ${characteristics.isTooShort ? "Too Short" : "Adequate"}
`
    : ""
}

YOUR TASK:
Rewrite the user's prompt to make it more effective for AI interactions. Output ONLY the improved prompt, nothing else. Do not answer the original prompt.`;
  }

  /**
   * Improve a prompt with analysis
   */
  async improve(req: Request, res: Response): Promise<void> {
    try {
      const { prompt } = req.body;
      const normalizedPrompt = normalizeWhitespace(prompt);

      if (
        !normalizedPrompt ||
        typeof normalizedPrompt !== "string" ||
        normalizedPrompt.trim().length === 0
      ) {
        res.status(400).json({ error: "Invalid prompt provided" });
        return;
      }

      // Step 1: Analyze the prompt
      const analysis = await analyzerService.analyzePrompt(normalizedPrompt);

      // Step 2: Build system prompt based on analysis
      const systemPrompt = this.buildSystemPrompt(analysis);

      // Step 3: Improve the prompt using the system prompt
      const improved = await improverService.improvePrompt(
        systemPrompt,
        normalizedPrompt,
      );

      res.status(200).json({
        success: true,
        data: {
          analysis,
          improvement: improved,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: "healthy" });
  }
}

export const promptController = new PromptController();
