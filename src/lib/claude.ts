import Anthropic from "@anthropic-ai/sdk";
import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent, ExtractedImage } from "./types";
import { getSystemPrompt, getUserPrompt, getRefinementPrompt } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Use Opus for creative generation work — Sonnet for extraction/analysis
const GENERATION_MODEL = "claude-sonnet-4-20250514";
const ANALYSIS_MODEL = "claude-sonnet-4-20250514";

/**
 * Extract the COMPLETE CSS design system from a reference website.
 * Two parallel calls: structured tokens + full prose design specification.
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

  const designSystemPrompt = `You are reverse-engineering a website's complete design system from its CSS and HTML. Produce a specification that another designer could use to recreate this exact look and feel.

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

1. COLOUR PALETTE — Every colour: primary, secondary, accent, backgrounds (hero, sections, cards, footer), text colours, borders, shadows, gradients (exact values), overlays.

2. TYPOGRAPHY — Font families (exact names), weights, heading sizes (h1-h6 with exact values), body size, line heights, letter spacing, text transforms.

3. SPACING & LAYOUT — Section padding, container max-width, grid columns/gaps, card padding, margins, spacing rhythm.

4. BORDERS & RADII — Border radius on cards/buttons/inputs/images. Border styles/widths/colours. Dividers.

5. SHADOWS & DEPTH — Box shadows (exact values), text shadows, glass/blur effects, overlay opacities.

6. BUTTONS & INTERACTIVE — Button styles (padding, radius, colours, weight), hover effects, transitions, focus states, link styles.

7. BACKGROUNDS & TEXTURES — Hero treatment (gradient direction, colours, overlays), section backgrounds, decorative elements, patterns, grain.

8. NAVIGATION — Height, background, logo style, link spacing, mobile approach, CTA button.

9. CARDS & COMPONENTS — Card padding/radius/shadow/border, hover states, icon sizing, form input styles.

10. ANIMATIONS & MOTION — Load animations, scroll reveals, hover transitions, timing functions, stagger patterns.

11. RESPONSIVE — Breakpoints, mobile changes, font scaling, grid collapse.

12. OVERALL AESTHETIC — Mood, personality, what makes it distinctive.

Be SPECIFIC with values — say "padding: 100px 0" not "large padding". Say "box-shadow: 0 8px 30px rgba(0,0,0,0.12)" not "subtle shadow". Exact CSS values.

Return as plain text (not JSON, not code blocks).`;

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
 * Extract business content from a tradie's existing website using Claude.
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
 * Generate a website with multi-turn refinement.
 * Turn 1: Generate initial HTML
 * Turn 2: Self-critique and improve against the design skill guidelines
 */
export async function generateWebsite(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
): Promise<string> {
  // Turn 1: Initial generation
  const initialMessage = await anthropic.messages.create({
    model: GENERATION_MODEL,
    max_tokens: 64000,
    system: getSystemPrompt(),
    messages: [
      {
        role: "user",
        content: getUserPrompt(businessInfo, designTokens, extractedContent),
      },
    ],
  });

  const initialBlock = initialMessage.content.find((block) => block.type === "text");
  if (!initialBlock || initialBlock.type !== "text") {
    throw new Error("No text response from generation");
  }

  let html = initialBlock.text.trim();
  if (html.startsWith("```")) {
    html = html.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
  }

  // Turn 2: Self-critique and refinement
  const refinedMessage = await anthropic.messages.create({
    model: GENERATION_MODEL,
    max_tokens: 64000,
    system: getSystemPrompt(),
    messages: [
      {
        role: "user",
        content: getUserPrompt(businessInfo, designTokens, extractedContent),
      },
      {
        role: "assistant",
        content: html,
      },
      {
        role: "user",
        content: getRefinementPrompt(html),
      },
    ],
  });

  const refinedBlock = refinedMessage.content.find((block) => block.type === "text");
  if (refinedBlock && refinedBlock.type === "text") {
    let refined = refinedBlock.text.trim();
    if (refined.startsWith("```")) {
      refined = refined.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
    }
    if (refined.startsWith("<!DOCTYPE") || refined.startsWith("<html")) {
      return refined;
    }
  }

  return html;
}

/**
 * Streaming generation with multi-turn refinement.
 * Streams Turn 1 for progress feedback, then does Turn 2 refinement non-streamed.
 * Returns a custom event emitter that sends chunks + a refinement phase.
 */
export function createGenerateStream(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
) {
  // For the streaming API route, we return an object that the route can use
  // to drive a two-phase generation
  return {
    async run(onChunk: (text: string) => void, onStatus: (status: string) => void): Promise<string> {
      // Phase 1: Stream initial generation
      onStatus("Designing your website...");

      const stream = anthropic.messages.stream({
        model: GENERATION_MODEL,
        max_tokens: 64000,
        system: getSystemPrompt(),
        messages: [
          {
            role: "user",
            content: getUserPrompt(businessInfo, designTokens, extractedContent),
          },
        ],
      });

      let initialHtml = "";

      stream.on("text", (text) => {
        initialHtml += text;
        onChunk(text);
      });

      await stream.finalMessage();

      // Clean up
      initialHtml = initialHtml.trim();
      if (initialHtml.startsWith("```")) {
        initialHtml = initialHtml.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
      }

      // Phase 2: Refinement pass (non-streamed, but notify user)
      onStatus("Polishing and refining the design...");

      try {
        const refinedMessage = await anthropic.messages.create({
          model: GENERATION_MODEL,
          max_tokens: 64000,
          system: getSystemPrompt(),
          messages: [
            {
              role: "user",
              content: getUserPrompt(businessInfo, designTokens, extractedContent),
            },
            {
              role: "assistant",
              content: initialHtml,
            },
            {
              role: "user",
              content: getRefinementPrompt(initialHtml),
            },
          ],
        });

        const refinedBlock = refinedMessage.content.find((b) => b.type === "text");
        if (refinedBlock && refinedBlock.type === "text") {
          let refined = refinedBlock.text.trim();
          if (refined.startsWith("```")) {
            refined = refined.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
          }
          if (refined.startsWith("<!DOCTYPE") || refined.startsWith("<html")) {
            return refined;
          }
        }
      } catch (err) {
        console.error("Refinement failed, using initial generation:", err);
      }

      // Fallback to initial if refinement fails
      return initialHtml;
    },
  };
}
