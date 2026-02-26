import Anthropic from "@anthropic-ai/sdk";
import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent, ExtractedImage } from "./types";
import { getSystemPrompt, getUserPrompt } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Use Claude to intelligently extract design tokens from a website's HTML.
 * Much more accurate than regex parsing — understands context, visual hierarchy, and brand identity.
 */
export async function analyzeDesignWithClaude(html: string, url: string): Promise<ExtractedDesignTokens> {
  // Trim HTML to avoid token limits — focus on <head> and first chunk of <body>
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : "";

  // Extract all <style> blocks
  const styleBlocks: string[] = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    styleBlocks.push(match[1]);
  }

  // Get inline styles from body (first 15000 chars to stay within limits)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)/i);
  const bodySnippet = bodyMatch ? bodyMatch[1].slice(0, 15000) : html.slice(0, 15000);

  const prompt = `Analyse this website's design and extract its design tokens as structured JSON.

URL: ${url}

<head_content>
${headContent.slice(0, 5000)}
</head_content>

<css_styles>
${styleBlocks.join("\n").slice(0, 8000)}
</css_styles>

<body_html_snippet>
${bodySnippet}
</body_html_snippet>

Extract the following as JSON:
{
  "colors": {
    "primary": "main brand colour (hex)",
    "secondary": "secondary brand colour (hex)",
    "accent": "accent/CTA colour (hex)",
    "background": "main background colour (hex)",
    "text": "main text colour (hex)"
  },
  "fonts": {
    "heading": "heading font family name (just the name, no fallbacks)",
    "body": "body font family name (just the name, no fallbacks)"
  },
  "style": "one of: minimal | bold | warm | dark | corporate | rustic",
  "layoutPatterns": ["array of layout patterns observed, e.g. hero-full, services-grid, testimonial-cards, split-about, contact-form"]
}

Rules:
- Return ONLY valid JSON, no markdown, no explanation
- For colours, use hex format (#RRGGBB)
- If you can't determine a colour, use sensible defaults that match the detected style
- For fonts, extract the actual Google Fonts or web font names used. If none detected, choose fonts that match the style
- The style should reflect the overall visual feel of the website
- Layout patterns should describe the actual section layouts you can identify`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from analysis");
    }

    // Parse JSON from response — handle potential markdown wrapping
    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    // Validate and ensure correct structure
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
    };
  } catch (err) {
    console.error("Claude design analysis failed, falling back to defaults:", err);
    throw err;
  }
}

/**
 * Use Claude to intelligently extract business content from a tradie's existing website.
 * Understands context — can find services, testimonials, about text, contact info from messy HTML.
 */
export async function extractContentWithClaude(
  html: string,
  url: string,
  imageUrls: { src: string; alt: string; type: string }[]
): Promise<ExtractedContent> {
  // Strip scripts and heavy content, keep meaningful text
  const cleaned = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");

  // Truncate to fit within context
  const htmlSnippet = cleaned.slice(0, 30000);

  const prompt = `You are extracting business information from a New Zealand tradie's website. Analyse the HTML and extract everything useful for rebuilding their website.

URL: ${url}

<website_html>
${htmlSnippet}
</website_html>

<detected_images>
${imageUrls.map((img) => `- ${img.type}: ${img.src} (alt: "${img.alt}")`).join("\n")}
</detected_images>

Extract the following as JSON:
{
  "businessName": "the business name",
  "tagline": "business tagline or slogan if found",
  "tradeType": "one of: builder, electrician, plumber, drainlayer, painter, roofer, landscaper, concrete, fencer, tiler, gasfitter, plasterer, demolition, earthworks, other",
  "location": "town or city",
  "region": "NZ region (e.g. Auckland, Canterbury, Waikato, Bay of Plenty, Wellington, Otago, Manawatu-Whanganui, Hawke's Bay, Northland, Taranaki, Southland, Nelson, Marlborough, Gisborne, West Coast, Tasman)",
  "phone": "phone number",
  "email": "email address",
  "aboutText": "the about/story text — combine all relevant paragraphs about the business, their history, what they do, and their approach. Make it natural and complete.",
  "services": ["array of specific services they offer"],
  "testimonials": [
    { "text": "testimonial quote", "name": "customer name", "location": "customer location if available" }
  ],
  "socialLinks": [
    { "platform": "facebook|instagram|linkedin|youtube", "url": "full url" }
  ],
  "yearsExperience": null or number,
  "rawTextSummary": "a 2-3 paragraph summary of ALL the important text content from the website that should be preserved in the new website"
}

Rules:
- Return ONLY valid JSON, no markdown, no explanation
- Extract REAL data from the HTML — do not make up information
- For aboutText, combine relevant sections into coherent paragraphs (avoid single-sentence fragments)
- For services, extract specific service names (e.g. "Bathroom Renovations", "New Builds") not generic terms
- For testimonials, only include ones that actually exist on the page
- For tradeType, match to the closest option from the list
- If a field can't be determined, use null
- NZ English spelling throughout`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from extraction");
    }

    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    // Build the structured response
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

export async function generateWebsite(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 64000,
    system: getSystemPrompt(),
    messages: [
      {
        role: "user",
        content: getUserPrompt(businessInfo, designTokens, extractedContent),
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
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
) {
  return anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 64000,
    system: getSystemPrompt(),
    messages: [
      {
        role: "user",
        content: getUserPrompt(businessInfo, designTokens, extractedContent),
      },
    ],
  });
}
