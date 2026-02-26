import Anthropic from "@anthropic-ai/sdk";
import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent, ExtractedImage } from "./types";
import { getSystemPrompt, getUserPrompt } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Use Claude to extract the COMPLETE CSS design system from a reference website.
 * Returns structured tokens AND a full prose description of the design system
 * that can be handed to the generation prompt to faithfully reproduce the look.
 */
export async function analyzeDesignWithClaude(html: string, url: string): Promise<ExtractedDesignTokens> {
  // Extract <head> for font links, meta etc.
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : "";

  // Extract ALL <style> blocks — this is the core design data
  const styleBlocks: string[] = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    styleBlocks.push(match[1]);
  }
  const allCss = styleBlocks.join("\n");

  // Extract inline styles from body for additional design cues
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)/i);
  const bodySnippet = bodyMatch ? bodyMatch[1].slice(0, 20000) : html.slice(0, 20000);

  // First call: extract structured tokens
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
    "primary": "#hex (main brand colour)",
    "secondary": "#hex (secondary brand colour)",
    "accent": "#hex (accent/CTA colour)",
    "background": "#hex (main background)",
    "text": "#hex (main text colour)"
  },
  "fonts": {
    "heading": "exact font family name for headings",
    "body": "exact font family name for body text"
  },
  "style": "minimal|bold|warm|dark|corporate|rustic",
  "layoutPatterns": ["array of section layout patterns observed"]
}`;

  // Second call: extract the FULL design system description
  const designSystemPrompt = `You are a senior web designer reverse-engineering a website's complete design system. Study the CSS, HTML structure, and visual patterns to produce a comprehensive design specification that another designer could use to recreate this exact look and feel.

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

Write a complete CSS DESIGN SYSTEM SPECIFICATION. Cover every aspect:

1. COLOUR PALETTE — Every colour used: primary, secondary, accent, backgrounds (hero, sections, cards, footer), text colours (headings, body, muted, links, hover states), borders, shadows, gradients (exact values), overlays.

2. TYPOGRAPHY — Font families (exact names), font weights used, heading sizes (h1 through h6 with exact rem/px values), body text size, line heights, letter spacing, text transforms (uppercase labels etc.), font style choices (italic, bold patterns).

3. SPACING & LAYOUT — Section padding (vertical and horizontal), container max-width, grid system (columns, gaps), card padding, element margins, the overall spacing rhythm (tight/generous/mixed).

4. BORDERS & RADII — Border radius on cards, buttons, inputs, images. Border styles, widths, colours. Dividers/separators.

5. SHADOWS & DEPTH — Box shadows (exact values), text shadows, layering/z-index patterns, glass/blur effects, overlay opacity values.

6. BUTTONS & INTERACTIVE — Button styles (padding, radius, colours, font weight), hover effects (colour changes, transforms, shadows), transition timing/easing, focus states, link styles.

7. BACKGROUNDS & TEXTURES — Hero treatment (gradient direction, colours, overlays), section backgrounds (alternating patterns), decorative elements, patterns, noise/grain, background images approach.

8. NAVIGATION — Height, background treatment (transparent/solid/glass), logo style, link spacing and styling, mobile menu approach, CTA button in nav.

9. CARDS & COMPONENTS — Card structure (padding, radius, shadow, border), hover states, icon sizing, badge/tag styles, list styles, form input styles.

10. ANIMATIONS & MOTION — Page load animations, scroll-triggered reveals, hover transitions, timing functions, stagger patterns.

11. RESPONSIVE APPROACH — Breakpoints, mobile layout changes, font size scaling, grid collapse patterns, mobile-specific treatments.

12. OVERALL AESTHETIC — The mood, personality, and design philosophy. What makes this design distinctive vs generic.

Be SPECIFIC with values. Don't say "large padding" — say "padding: 100px 0" or "clamp(60px, 10vw, 120px)". Don't say "dark shadow" — say "box-shadow: 0 8px 30px rgba(0,0,0,0.12)". Exact values that can be directly used in CSS.

Return the specification as plain text (not JSON, not markdown code blocks).`;

  try {
    // Run both extractions in parallel
    const [tokensResponse, designSystemResponse] = await Promise.all([
      anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: tokensPrompt }],
      }),
      anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: designSystemPrompt }],
      }),
    ]);

    // Parse tokens
    const tokensText = tokensResponse.content.find((b) => b.type === "text");
    if (!tokensText || tokensText.type !== "text") throw new Error("No tokens response");

    let jsonStr = tokensText.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(jsonStr);

    // Get design system description
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
