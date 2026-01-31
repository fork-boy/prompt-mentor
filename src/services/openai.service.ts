import { config } from "../config/env";

/**
 * OpenAI Service - Handles communication with OpenAI API
 */

export interface OpenAIResponse {
  content: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export class OpenAIService {
  private apiKey: string;
  private baseURL: string = "https://api.openai.com/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || config.openaiApiKey;
    if (!this.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }
  }

  /**
   * Send a request to OpenAI API
   */
  async sendRequest(
    prompt: string,
    systemPrompt?: string,
  ): Promise<OpenAIResponse> {
    try {
      const messages: Array<{ role: string; content: string }> = [];

      if (systemPrompt) {
        messages.push({
          role: "system",
          content: systemPrompt,
        });
      }

      messages.push({
        role: "user",
        content: prompt,
      });

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as any;
        throw new Error(
          `OpenAI API error: ${error.error?.message || "Unknown error"}`,
        );
      }

      const data: any = await response.json();

      return {
        content: data.choices[0]?.message?.content || "",
        tokens: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
      };
    } catch (error: unknown) {
      throw new Error(
        `OpenAI service error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Generate a completion for a given prompt
   */
  async generateCompletion(prompt: string): Promise<string> {
    const response = await this.sendRequest(prompt);
    return response.content;
  }
}

export const openaiService = new OpenAIService();
