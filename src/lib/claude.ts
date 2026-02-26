import Anthropic from "@anthropic-ai/sdk";
import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent, ExtractedImage } from "./types";
import { getUserPrompt, getRefinementPrompt } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GENERATION_MODEL = "claude-sonnet-4-20250514";
const ANALYSIS_MODEL = "claude-sonnet-4-20250514";

const SKILL_ID = process.env.FRONTEND_DESIGN_SKILL_ID || "";
const SKILLS_BETAS = ["code-execution-2025-08-25", "skills-2025-10-02"];

/**
 * Extract the complete CSS design system from a reference website.
 */
export async function analyzeDesignWithClaude(html: string, url: string): Promise<ExtractedDesignTokens> {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : "";

  const styleBlocks: string[] = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    styleBlocks.push(match[1]);
  }
  const allCss = styleBlocks.join("\n");

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)/i);
  const bodySnippet = bodyMatch ? bodyMatch[1].slice(0, 20000) : html.slice(0, 20000);

  const tokensPrompt = `Analyse this website and extract its design tokens as JSON.

URL: ${url}

<head>
${headContent.slice(0, 5000)}
</head>

<css>
${allCss.slice(0, 10000)}
</css>

<body_snippet>
${bodySnippet.slice(0, 10000)}
</body_snippet>

Return ONLY this JSON (no markdown, no explanation):
{
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "fonts": {
    "heading": "font family name",
    "body": "font family name"
  },
  "style": "minimal|bold|warm|dark|corporate|rustic",
  "layoutPatterns": ["observed layout patterns"]
}`;

  const designSystemPrompt = `You are reverse-engineering a website's complete design system. Produce a specification another designer could use to recreate this exact look and feel.

URL: ${url}

<head>
${headContent.slice(0, 4000)}
</head>

<full_css>
${allCss.slice(0, 15000)}
</full_css>

<html_structure>
${bodySnippet.slice(0, 12000)}
</html_structure>

Write a complete CSS DESIGN SYSTEM SPECIFICATION covering:
1. COLOUR PALETTE — Every colour with exact values
2. TYPOGRAPHY — Font families, weights, sizes, line heights, letter spacing
3. SPACING & LAYOUT — Section padding, container width, grid, margins
4. BORDERS & RADII — Exact border-radius, border styles
5. SHADOWS & DEPTH — Exact box-shadow values, blur effects
6. BUTTONS & INTERACTIVE — Styles, hover effects, transitions
7. BACKGROUNDS & TEXTURES — Gradients, patterns, overlays
8. NAVIGATION — Height, background, styles
9. CARDS & COMPONENTS — Padding, radius, shadow, hover states
10. ANIMATIONS & MOTION — Scroll reveals, transitions, timing
11. RESPONSIVE — Breakpoints, mobile changes
12. OVERALL AESTHETIC — Mood, personality, what makes it distinctive

Be SPECIFIC with CSS values. Return as plain text.`;

  try {
    const [tokensResponse, designSystemResponse] = await Promise.all([
      anthropic.messages.create({
        model: ANALYSIS_MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: tokensPrompt }],
      }),
      anthropic.messages.create({
        model: ANALYSIS_MODEL,
        max_tokens: 4096,
        messages: [{ role: "user", content: designSystemPrompt }],
      }),
    ]);

    const tokensText = tokensResponse.content.find((b) => b.type === "text");
    if (!tokensText || tokensText.type !== "text") throw new Error("No tokens response");

    let jsonStr = tokensText.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(jsonStr);

    const designText = designSystemResponse.content.find((b) => b.type === "text");
    const cssDesignSystem = designText && designText.type === "text" ? designText.text.trim() : "";

    return {
      colors: {
        primary: parsed.colors?.primary || "#2C3E50",
        secondary: parsed.colors?.secondary || "#E67E22",
        accent: parsed.colors?.accent || "#F39C12",
        background: parsed.colors?.background || "#FAFAFA",
        text: parsed.colors?.text || "#2C3E50",
      },
      fonts: {
        heading: parsed.fonts?.heading || "Montserrat",
        body: parsed.fonts?.body || "Open Sans",
      },
      style: ["minimal", "bold", "warm", "dark", "corporate", "rustic"].includes(parsed.style)
        ? parsed.style
        : "minimal",
      layoutPatterns: Array.isArray(parsed.layoutPatterns)
        ? parsed.layoutPatterns
        : ["hero-full", "services-grid", "testimonial-cards"],
      cssDesignSystem,
    };
  } catch (err) {
    console.error("Claude design analysis failed:", err);
    throw err;
  }
}

/**
 * Extract business content from a tradie's existing website.
 */
export async function extractContentWithClaude(
  html: string,
  url: string,
  imageUrls: { src: string; alt: string; type: string }[]
): Promise<ExtractedContent> {
  const cleaned = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");

  const htmlSnippet = cleaned.slice(0, 30000);

  const prompt = `Extract business information from this NZ tradie's website as JSON.

URL: ${url}

<website_html>
${htmlSnippet}
</website_html>

<detected_images>
${imageUrls.map((img) => `- ${img.type}: ${img.src} (alt: "${img.alt}")`).join("\n")}
</detected_images>

Return ONLY valid JSON:
{
  "businessName": "string",
  "tagline": "string or null",
  "tradeType": "builder|electrician|plumber|drainlayer|painter|roofer|landscaper|concrete|fencer|tiler|gasfitter|plasterer|demolition|earthworks|other",
  "location": "town/city",
  "region": "NZ region",
  "phone": "phone number or null",
  "email": "email or null",
  "aboutText": "combined about text paragraphs",
  "services": ["specific service names"],
  "testimonials": [{"text": "quote", "name": "name", "location": "location or null"}],
  "socialLinks": [{"platform": "name", "url": "url"}],
  "yearsExperience": null or number,
  "rawTextSummary": "2-3 paragraph summary of all important website text"
}

Rules: Extract REAL data only. NZ English. Use null for unknown fields.`;

  try {
    const message = await anthropic.messages.create({
      model: ANALYSIS_MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No response");

    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(jsonStr);

    const businessInfo: Partial<import("./types").BusinessInfo> = {};
    if (parsed.businessName) businessInfo.businessName = parsed.businessName;
    if (parsed.tradeType) businessInfo.tradeType = parsed.tradeType;
    if (parsed.location) businessInfo.location = parsed.location;
    if (parsed.region) businessInfo.region = parsed.region;
    if (parsed.phone) businessInfo.phone = parsed.phone;
    if (parsed.email) businessInfo.email = parsed.email;
    if (parsed.aboutText) businessInfo.aboutText = parsed.aboutText;
    if (parsed.tagline) businessInfo.tagline = parsed.tagline;
    if (parsed.yearsExperience) businessInfo.yearsExperience = parsed.yearsExperience;
    if (Array.isArray(parsed.services) && parsed.services.length > 0) {
      businessInfo.services = parsed.services;
    }

    return {
      businessInfo,
      images: imageUrls as ExtractedImage[],
      rawText: parsed.rawTextSummary || "",
      services: parsed.services || [],
      testimonials: parsed.testimonials || [],
      socialLinks: parsed.socialLinks || [],
    };
  } catch (err) {
    console.error("Claude content extraction failed:", err);
    throw err;
  }
}

/**
 * Generate website using the Agent Skills API.
 * The frontend-design skill is loaded via the container parameter,
 * giving Claude access to the skill's design philosophy and guidelines.
 * Uses multi-turn: generate → self-critique → refine.
 */
export function createGenerateStream(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
) {
  return {
    async run(onChunk: (text: string) => void, onStatus: (status: string) => void): Promise<string> {
      const userPrompt = getUserPrompt(businessInfo, designTokens, extractedContent);

      // Check if we have a skill ID — if so, use Agent Skills API
      const useSkillsApi = !!SKILL_ID;

      // Phase 1: Initial generation
      onStatus("Designing your website...");

      let initialHtml = "";

      if (useSkillsApi) {
        // Use Agent Skills API with the frontend-design skill
        const response = await anthropic.beta.messages.create({
          model: GENERATION_MODEL,
          max_tokens: 64000,
          betas: SKILLS_BETAS,
          container: {
            skills: [
              {
                type: "custom" as const,
                skill_id: SKILL_ID,
                version: "latest",
              },
            ],
          },
          messages: [
            { role: "user", content: userPrompt },
          ],
          tools: [
            { type: "code_execution_20250825" as const, name: "code_execution" },
          ],
        });

        // Handle pause_turn for long operations
        let currentResponse = response;
        let messages: Anthropic.Beta.Messages.BetaMessageParam[] = [
          { role: "user", content: userPrompt },
        ];

        for (let i = 0; i < 5; i++) {
          if (currentResponse.stop_reason !== "pause_turn") break;

          messages = [
            ...messages,
            { role: "assistant" as const, content: currentResponse.content },
          ];

          currentResponse = await anthropic.beta.messages.create({
            model: GENERATION_MODEL,
            max_tokens: 64000,
            betas: SKILLS_BETAS,
            container: {
              id: currentResponse.container?.id,
              skills: [
                {
                  type: "custom" as const,
                  skill_id: SKILL_ID,
                  version: "latest",
                },
              ],
            },
            messages,
            tools: [
              { type: "code_execution_20250825" as const, name: "code_execution" },
            ],
          });
        }

        // Extract the HTML from the response content
        for (const block of currentResponse.content) {
          if (block.type === "text") {
            initialHtml += block.text;
          }
        }

        // Send the full response as chunks for client progress
        onChunk(initialHtml);
      } else {
        // Fallback: stream without skills API
        const stream = anthropic.messages.stream({
          model: GENERATION_MODEL,
          max_tokens: 64000,
          messages: [
            { role: "user", content: userPrompt },
          ],
        });

        stream.on("text", (text) => {
          initialHtml += text;
          onChunk(text);
        });

        await stream.finalMessage();
      }

      // Clean up
      initialHtml = initialHtml.trim();
      if (initialHtml.startsWith("```")) {
        initialHtml = initialHtml.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
      }

      // Phase 2: Refinement pass
      onStatus("Polishing and refining the design...");

      try {
        let refinedHtml = "";

        if (useSkillsApi) {
          const refinedResponse = await anthropic.beta.messages.create({
            model: GENERATION_MODEL,
            max_tokens: 64000,
            betas: SKILLS_BETAS,
            container: {
              skills: [
                {
                  type: "custom" as const,
                  skill_id: SKILL_ID,
                  version: "latest",
                },
              ],
            },
            messages: [
              { role: "user", content: userPrompt },
              { role: "assistant", content: initialHtml },
              { role: "user", content: getRefinementPrompt(initialHtml) },
            ],
            tools: [
              { type: "code_execution_20250825" as const, name: "code_execution" },
            ],
          });

          // Handle pause_turn
          let currentResponse = refinedResponse;
          let messages: Anthropic.Beta.Messages.BetaMessageParam[] = [
            { role: "user", content: userPrompt },
            { role: "assistant", content: initialHtml },
            { role: "user", content: getRefinementPrompt(initialHtml) },
          ];

          for (let i = 0; i < 5; i++) {
            if (currentResponse.stop_reason !== "pause_turn") break;

            messages = [
              ...messages,
              { role: "assistant" as const, content: currentResponse.content },
            ];

            currentResponse = await anthropic.beta.messages.create({
              model: GENERATION_MODEL,
              max_tokens: 64000,
              betas: SKILLS_BETAS,
              container: {
                id: currentResponse.container?.id,
                skills: [
                  {
                    type: "custom" as const,
                    skill_id: SKILL_ID,
                    version: "latest",
                  },
                ],
              },
              messages,
              tools: [
                { type: "code_execution_20250825" as const, name: "code_execution" },
              ],
            });
          }

          for (const block of currentResponse.content) {
            if (block.type === "text") {
              refinedHtml += block.text;
            }
          }
        } else {
          // Fallback: standard API refinement
          const refinedMessage = await anthropic.messages.create({
            model: GENERATION_MODEL,
            max_tokens: 64000,
            messages: [
              { role: "user", content: userPrompt },
              { role: "assistant", content: initialHtml },
              { role: "user", content: getRefinementPrompt(initialHtml) },
            ],
          });

          for (const block of refinedMessage.content) {
            if (block.type === "text") {
              refinedHtml += block.text;
            }
          }
        }

        refinedHtml = refinedHtml.trim();
        if (refinedHtml.startsWith("```")) {
          refinedHtml = refinedHtml.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
        }

        if (refinedHtml.startsWith("<!DOCTYPE") || refinedHtml.startsWith("<html")) {
          return refinedHtml;
        }
      } catch (err) {
        console.error("Refinement failed, using initial generation:", err);
      }

      return initialHtml;
    },
  };
}

/**
 * Non-streaming generation (kept for backwards compatibility).
 */
export async function generateWebsite(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
): Promise<string> {
  const generator = createGenerateStream(businessInfo, designTokens, extractedContent);
  return generator.run(() => {}, () => {});
}
