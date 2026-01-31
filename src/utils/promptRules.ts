/**
 * Prompt improvement rules and guidelines
 */

export interface PromptRule {
  id: string;
  name: string;
  description: string;
  apply: (prompt: string) => string;
}

export const promptRules: PromptRule[] = [
  {
    id: "be-specific",
    name: "Be Specific",
    description: "Replace vague terms with specific details",
    apply: (prompt: string): string => {
      const replacements: Record<string, string> = {
        good: "high-quality, effective",
        bad: "problematic, suboptimal",
        thing: "object, concept, idea",
        stuff: "information, content, data",
        nice: "well-designed, elegant, professional",
        big: "significantly, substantially, considerably",
      };

      let result = prompt;
      for (const [vague, specific] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${vague}\\b`, "gi");
        result = result.replace(regex, specific);
      }
      return result;
    },
  },
  {
    id: "add-context",
    name: "Add Context",
    description: "Add necessary context and background information",
    apply: (prompt: string): string => {
      if (!prompt.includes("context") && !prompt.includes("background")) {
        return `${prompt} Please provide context and background for your response.`;
      }
      return prompt;
    },
  },
  {
    id: "structure-clearly",
    name: "Structure Clearly",
    description: "Organize prompt with clear sections or numbered points",
    apply: (prompt: string): string => {
      if (!prompt.includes("\n") && prompt.length > 100) {
        return `${prompt}\n\nPlease structure your response with clear sections or numbered points.`;
      }
      return prompt;
    },
  },
  {
    id: "define-scope",
    name: "Define Scope",
    description: "Clearly define what is in and out of scope",
    apply: (prompt: string): string => {
      if (
        !prompt.includes("scope") &&
        !prompt.includes("include") &&
        !prompt.includes("exclude")
      ) {
        return `${prompt} Please clarify the scope and boundaries of what should be included.`;
      }
      return prompt;
    },
  },
  {
    id: "set-format",
    name: "Set Format",
    description: "Specify the desired output format",
    apply: (prompt: string): string => {
      if (
        !prompt.includes("format") &&
        !prompt.includes("output") &&
        !prompt.includes("structure")
      ) {
        return `${prompt} Please provide the response in a clear, structured format.`;
      }
      return prompt;
    },
  },
];

/**
 * Get applicable rules for a prompt
 */
export function getApplicableRules(prompt: string): PromptRule[] {
  return promptRules.filter((rule) => {
    // Rules that detect missing elements
    if (
      rule.id === "add-context" &&
      !prompt.toLowerCase().includes("context")
    ) {
      return true;
    }
    if (rule.id === "define-scope" && !prompt.toLowerCase().includes("scope")) {
      return true;
    }
    if (rule.id === "set-format" && !prompt.toLowerCase().includes("format")) {
      return true;
    }
    if (
      rule.id === "be-specific" &&
      prompt.match(/\b(good|bad|thing|stuff|nice)\b/gi)
    ) {
      return true;
    }
    if (
      rule.id === "structure-clearly" &&
      prompt.length > 100 &&
      !prompt.includes("\n")
    ) {
      return true;
    }
    return false;
  });
}

/**
 * Apply rules to improve prompt
 */
export function applyRules(prompt: string, ruleIds?: string[]): string {
  const rulesToApply = ruleIds
    ? promptRules.filter((r) => ruleIds.includes(r.id))
    : getApplicableRules(prompt);

  return rulesToApply.reduce((improved, rule) => rule.apply(improved), prompt);
}
