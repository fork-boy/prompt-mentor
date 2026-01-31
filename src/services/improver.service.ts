import { applyRules } from "../utils/promptRules";
import { openaiService } from "./openai.service";

/**
 * Improver Service - Suggests improvements for prompts
 */

export interface ImprovementResult {
  originalPrompt: string;
  improvedPrompt: string;
  suggestions: string[];
  aiSuggestions?: string;
}

export class ImproverService {
  /**
   * Improve a prompt with system prompt guidance
   */
  async improvePrompt(
    systemPrompt: string,
    prompt: string,
  ): Promise<ImprovementResult> {
    // Get AI-powered improvement with system prompt
    let improvedPrompt: string | undefined;
    try {
      improvedPrompt = await openaiService
        .sendRequest(prompt, systemPrompt)
        .then((res) => res.content);
    } catch (error) {
      console.error("Failed to get AI improvement:", error);
      // Fallback to rule-based improvement
      improvedPrompt = applyRules(prompt);
    }
    return {
      originalPrompt: prompt,
      improvedPrompt: improvedPrompt || applyRules(prompt),
      suggestions: this.generateSuggestions(prompt),
    };
  }

  /**
   * Generate specific suggestions for improvement
   */
  private generateSuggestions(prompt: string): string[] {
    const suggestions: string[] = [];

    // Check for vague language
    const vagueTerms = prompt.match(/\b(good|bad|thing|stuff|nice)\b/gi);
    if (vagueTerms && vagueTerms.length > 0) {
      suggestions.push(
        `Replace vague terms like "${vagueTerms[0]}" with more specific language`,
      );
    }

    // Check for lack of context
    if (prompt.length < 50) {
      suggestions.push(
        "Add more context and background information to your prompt",
      );
    }

    // Check for questions
    if (!prompt.includes("?") && !prompt.toLowerCase().includes("please")) {
      suggestions.push(
        "Use questions or polite directives to make your intent clear",
      );
    }

    // Check for structure
    if (!prompt.includes("\n") && prompt.length > 100) {
      suggestions.push(
        "Break your prompt into multiple lines or sections for clarity",
      );
    }

    // Check for format specification
    if (
      !prompt.toLowerCase().includes("format") &&
      !prompt.toLowerCase().includes("structure")
    ) {
      suggestions.push(
        "Specify the desired format or structure for the response",
      );
    }

    // Check for scope definition
    if (
      !prompt.toLowerCase().includes("include") &&
      !prompt.toLowerCase().includes("exclude")
    ) {
      suggestions.push(
        "Define what should and should not be included in the response",
      );
    }

    return suggestions.length > 0
      ? suggestions
      : [
          "Your prompt is well-structured. Consider adding examples for even better results.",
        ];
  }
}

export const improverService = new ImproverService();
