import Anthropic from "@anthropic-ai/sdk";
import type { BusinessInfo, ExtractedDesignTokens } from "./types";
import { getSystemPrompt, getUserPrompt } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateWebsite(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    system: getSystemPrompt(),
    messages: [
      {
        role: "user",
        content: getUserPrompt(businessInfo, designTokens),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response received from generation service");
  }

  return textBlock.text;
}

export function createGenerateStream(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens
) {
  return anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    system: getSystemPrompt(),
    messages: [
      {
        role: "user",
        content: getUserPrompt(businessInfo, designTokens),
      },
    ],
  });
}
