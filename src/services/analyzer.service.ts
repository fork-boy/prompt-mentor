import { calculatePromptScore } from "../utils/score";

/**
 * Analyzer Service - Analyzes prompt quality and characteristics
 */

export interface AnalysisResult {
  originalPrompt: string;
  score: number;
  feedback: string;
  analysis: {
    clarity: string;
    specificity: string;
    context: string;
    structure: string;
  };
  characteristics: {
    hasRole: boolean;
    hasConstraints: boolean;
    isTooShort: boolean;
    hasExamples: boolean;
  };
}

export class AnalyzerService {
  /**
   * Analyze a prompt and return detailed analysis
   */
  async analyzePrompt(prompt: string): Promise<AnalysisResult> {
    // Calculate basic score
    const scoreResult = calculatePromptScore(prompt);

    // Get prompt characteristics
    const characteristics = this.analyzeCharacteristics(prompt);

    return {
      originalPrompt: prompt,
      score: scoreResult.score,
      feedback: scoreResult.feedback,
      analysis: {
        clarity: this.analyzeClarityScore(prompt),
        specificity: this.analyzeSpecificityScore(prompt),
        context: this.analyzeContextScore(prompt),
        structure: this.analyzeStructureScore(prompt),
      },
      characteristics,
    };
  }

  /**
   * Analyze prompt characteristics
   */
  private analyzeCharacteristics(prompt: string) {
    return {
      hasRole: /act as|you are|as a/i.test(prompt),
      hasConstraints: /format|only|must|should|don't|do not/i.test(prompt),
      isTooShort: prompt.split(/\s+/).length < 8,
      hasExamples: /example|such as|like|e\.g\./i.test(prompt),
    };
  }

  /**
   * Analyze clarity of the prompt
   */
  private analyzeClarityScore(prompt: string): string {
    const hasQuestions = prompt.includes("?");
    const hasCommands =
      prompt.includes("please") ||
      prompt.includes("help") ||
      prompt.includes("can you");
    const clarity = hasQuestions || hasCommands ? "High" : "Medium";

    return `Clarity: ${clarity} - ${hasQuestions ? "Uses clear questions" : "Could use clearer directives"}.`;
  }

  /**
   * Analyze specificity of the prompt
   */
  private analyzeSpecificityScore(prompt: string): string {
    const vagueTerms = prompt.match(/\b(thing|stuff|good|bad|nice)\b/gi);
    const hasExamples = /example|such as|like|e\.g\./i.test(prompt);
    const specificity =
      vagueTerms && vagueTerms.length > 0
        ? "Low"
        : hasExamples
          ? "High"
          : "Medium";

    return `Specificity: ${specificity} - ${vagueTerms && vagueTerms.length > 0 ? "Replace vague terms with specific details" : "Includes specific terms"}.`;
  }

  /**
   * Analyze context of the prompt
   */
  private analyzeContextScore(prompt: string): string {
    const wordCount = prompt.split(/\s+/).length;
    const hasBackground =
      prompt.toLowerCase().includes("background") ||
      prompt.toLowerCase().includes("context");
    const context =
      wordCount > 50 && hasBackground
        ? "High"
        : wordCount > 50
          ? "Medium"
          : "Low";

    return `Context: ${context} - ${hasBackground ? "Provides background information" : "Could include more context"}.`;
  }

  /**
   * Analyze structure of the prompt
   */
  private analyzeStructureScore(prompt: string): string {
    const hasParagraphs = prompt.split("\n").length > 2;
    const hasNumberedPoints = /^\d+\.|^-|^\*/m.test(prompt);
    const structure = hasParagraphs || hasNumberedPoints ? "High" : "Medium";

    return `Structure: ${structure} - ${hasParagraphs || hasNumberedPoints ? "Well-organized" : "Could benefit from better organization"}.`;
  }
}

export const analyzerService = new AnalyzerService();
