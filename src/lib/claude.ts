import Anthropic from "@anthropic-ai/sdk";
import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent, ExtractedImage } from "./types";
import { buildPlanPrompt, GENERATE_PROMPT, REFINE_PROMPT, getTextRefinementPrompt } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SONNET_MODEL = "claude-sonnet-4-6";
const OPUS_MODEL = "claude-opus-4-6";

const SKILL_ID = process.env.FRONTEND_DESIGN_SKILL_ID || "";
const BETAS = [
  "code-execution-2025-08-25" as const,
  "skills-2025-10-02" as const,
  "files-api-2025-04-14" as const,
];

const SHARED_TOOLS = [
  { type: "code_execution_20250825" as const, name: "code_execution" as const },
];

const SHARED_PARAMS = {
  model: OPUS_MODEL,
  betas: BETAS,
  cache_control: { type: "ephemeral" as const },
  tools: SHARED_TOOLS,
};

const SKILL_CONFIG = [
  { type: "custom" as const, skill_id: SKILL_ID, version: "latest" },
];

// ─── Helpers ───

function logUsage(label: string, response: Anthropic.Beta.Messages.BetaMessage) {
  const u = response.usage;
  const cache = (u as unknown as Record<string, number>);
  console.log(
    `[CTW] ${label} | stop=${response.stop_reason} | ` +
    `in=${u.input_tokens} out=${u.output_tokens} ` +
    `cache_read=${cache.cache_read_input_tokens ?? 0} cache_write=${cache.cache_creation_input_tokens ?? 0} | ` +
    `container=${response.container?.id ?? "none"}`
  );
}

function elapsed(start: number): string {
  return `${((Date.now() - start) / 1000).toFixed(1)}s`;
}

/**
 * Stream a beta messages call and return the final BetaMessage.
 * Required because synchronous calls timeout for long Opus generations.
 */
async function streamBetaMessage(
  params: Parameters<typeof anthropic.beta.messages.create>[0],
): Promise<Anthropic.Beta.Messages.BetaMessage> {
  const stream = anthropic.beta.messages.stream(params);
  return await stream.finalMessage();
}

async function handlePauseTurn(
  response: Anthropic.Beta.Messages.BetaMessage,
  messages: Anthropic.Beta.Messages.BetaMessageParam[],
  containerId?: string,
  label = "pause_turn",
): Promise<Anthropic.Beta.Messages.BetaMessage> {
  let current = response;
  for (let i = 0; i < 10; i++) {
    if (current.stop_reason !== "pause_turn") break;
    console.log(`[CTW] ${label} iteration ${i + 1} — resuming...`);

    messages.push({ role: "assistant", content: current.content });

    const start = Date.now();
    current = await streamBetaMessage({
      ...SHARED_PARAMS,
      max_tokens: 64000,
      container: {
        id: containerId || current.container?.id,
        skills: SKILL_CONFIG,
      },
      messages,
    });
    logUsage(`${label} resume (${elapsed(start)})`, current);
  }
  return current;
}

function extractHtmlFromResponse(response: Anthropic.Beta.Messages.BetaMessage): string | null {
  // 1. Check code execution stdout (Opus writes HTML via code execution)
  for (const block of response.content) {
    const b = block as Record<string, unknown>;
    if (b.type === "code_execution_tool_result" || b.type === "bash_code_execution_tool_result") {
      const result = b.content as Record<string, unknown>;
      if (typeof result?.stdout === "string") {
        const stdout = (result.stdout as string).trim();
        if (stdout.startsWith("<!DOCTYPE") || stdout.startsWith("<html")) {
          console.log(`[CTW] Extracted HTML from code execution stdout (${stdout.length} chars)`);
          return stdout;
        }
        // HTML might be buried after other stdout — find it
        const idx = stdout.indexOf("<!DOCTYPE");
        if (idx !== -1) {
          const extracted = stdout.slice(idx).trim();
          console.log(`[CTW] Extracted HTML from code execution stdout at offset ${idx} (${extracted.length} chars)`);
          return extracted;
        }
      }
    }
  }

  // 2. Check text blocks (non-code-execution path)
  let text = "";
  for (const block of response.content) {
    if (block.type === "text") text += block.text;
  }
  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
  }
  if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) return text;

  // 3. Last resort — find HTML anywhere in text blocks
  const idx = text.indexOf("<!DOCTYPE");
  if (idx !== -1) {
    const extracted = text.slice(idx).trim();
    console.log(`[CTW] Extracted HTML from text at offset ${idx} (${extracted.length} chars)`);
    return extracted;
  }

  return null;
}

function extractTextFromResponse(response: Anthropic.Beta.Messages.BetaMessage): string {
  let text = "";
  for (const block of response.content) {
    if (block.type === "text") text += block.text;
  }
  return text;
}

// ─── Batch 1: Parallel Sonnet 4.6 Calls ───

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
    console.log(`[CTW] Analyse: starting parallel Sonnet calls for ${url}`);
    const analyseStart = Date.now();

    const [tokensResponse, designSystemResponse] = await Promise.all([
      anthropic.messages.create({
        model: SONNET_MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: tokensPrompt }],
      }),
      anthropic.messages.create({
        model: SONNET_MODEL,
        max_tokens: 4096,
        messages: [{ role: "user", content: designSystemPrompt }],
      }),
    ]);

    console.log(`[CTW] Analyse: done (${elapsed(analyseStart)}) | tokens: in=${tokensResponse.usage.input_tokens}+${designSystemResponse.usage.input_tokens} out=${tokensResponse.usage.output_tokens}+${designSystemResponse.usage.output_tokens}`);

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
 * Extract business content from a tradie's multi-page website.
 */
export async function extractContentWithClaude(
  pages: { url: string; html: string }[],
  baseUrl: string,
  imageUrls: { src: string; alt: string; type: string }[]
): Promise<ExtractedContent> {
  // Build a combined snippet from all crawled pages
  const pageSnippets = pages.map((page) => {
    const cleaned = page.html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");
    const path = new URL(page.url).pathname;
    // Give homepage more space, sub-pages less
    const limit = page.url === baseUrl ? 15000 : 8000;
    return `<page url="${path}">\n${cleaned.slice(0, limit)}\n</page>`;
  });

  const prompt = `Extract ALL business information from this tradie's website. We have crawled multiple pages.

Website: ${baseUrl}

${pageSnippets.join("\n\n")}

<detected_images>
${imageUrls.map((img) => `- ${img.type}: ${img.src} (alt: "${img.alt}")`).join("\n")}
</detected_images>

Return ONLY valid JSON:
{
  "businessName": "string",
  "tagline": "string or null",
  "tradeType": "builder|electrician|plumber|drainlayer|painter|roofer|landscaper|concrete|fencer|tiler|gasfitter|plasterer|demolition|earthworks|other",
  "location": "town/city",
  "region": "NZ region or country",
  "phone": "phone number or null",
  "email": "email or null",
  "address": "full street address or null",
  "aboutText": "combined about text from all pages — preserve their authentic voice",
  "services": ["ONLY real services listed on the website — never invent services"],
  "projects": [{"title": "project name", "description": "brief description", "imageUrl": "image URL if found or null"}],
  "testimonials": [{"text": "quote", "name": "name", "location": "location or null"}],
  "socialLinks": [{"platform": "name", "url": "url"}],
  "yearsExperience": null or number,
  "logoUrl": "URL of the business logo or null",
  "heroImageUrl": "URL of the main hero/banner image or null",
  "images": [{"src": "full URL", "alt": "description", "type": "logo|hero|gallery|team|project|other", "page": "which page it was found on"}],
  "rawTextSummary": "3-4 paragraph summary of ALL important text across all pages"
}

Rules:
- Extract REAL data only from what's actually on the pages. NEVER invent or hallucinate services, projects, or content.
- Include ALL images found with their full URLs — these will be used in the generated website.
- Identify the logo (usually top-left of header) and hero image (large banner image) specifically.
- NZ English. Use null for unknown fields.`;

  try {
    console.log(`[CTW] Extract: starting Sonnet call for ${baseUrl} (${pages.length} pages)`);
    const extractStart = Date.now();

    const message = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    console.log(`[CTW] Extract: done (${elapsed(extractStart)}) | in=${message.usage.input_tokens} out=${message.usage.output_tokens}`);

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

    // Merge Claude-classified images with regex-detected ones
    const classifiedImages: ExtractedImage[] = Array.isArray(parsed.images)
      ? parsed.images.map((img: { src: string; alt: string; type: string }) => ({
          src: img.src,
          alt: img.alt || "",
          type: img.type || "other",
        }))
      : imageUrls as ExtractedImage[];

    // Ensure logo and hero are in the image list if Claude found them
    if (parsed.logoUrl && !classifiedImages.some((img: ExtractedImage) => img.src === parsed.logoUrl)) {
      classifiedImages.unshift({ src: parsed.logoUrl, alt: "Logo", type: "logo" });
    }
    if (parsed.heroImageUrl && !classifiedImages.some((img: ExtractedImage) => img.src === parsed.heroImageUrl)) {
      classifiedImages.unshift({ src: parsed.heroImageUrl, alt: "Hero", type: "hero" });
    }

    console.log(`[CTW] Extract: ${classifiedImages.length} images, ${parsed.services?.length || 0} services, ${parsed.projects?.length || 0} projects`);

    return {
      businessInfo,
      images: classifiedImages,
      rawText: parsed.rawTextSummary || "",
      services: parsed.services || [],
      testimonials: parsed.testimonials || [],
      socialLinks: parsed.socialLinks || [],
      projects: parsed.projects || [],
      logoUrl: parsed.logoUrl || null,
      heroImageUrl: parsed.heroImageUrl || null,
    };
  } catch (err) {
    console.error("Claude content extraction failed:", err);
    throw err;
  }
}

// ─── Batch 2: Multi-Turn Opus Conversation (Plan → Generate → Refine) ───

/**
 * Generate website using the 3-turn Opus pipeline with Agent Skills API.
 * Turn 1: Plan (creative brief) — front-loads all context, gets cached
 * Turn 2: Generate (build HTML) — short prompt, cached context
 * Turn 3: Refine (polish) — screenshots or text fallback, cached context
 */
export function createGenerateStream(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
) {
  return {
    async run(onChunk: (text: string) => void, onStatus: (status: string) => void): Promise<string> {
      const useSkillsApi = !!SKILL_ID;

      if (!useSkillsApi) {
        console.log("[CTW] No SKILL_ID set — using fallback pipeline");
        return runFallbackPipeline(businessInfo, designTokens, extractedContent, onChunk, onStatus);
      }

      console.log(`[CTW] ═══ Starting 3-turn Opus pipeline ═══`);
      console.log(`[CTW] Skill ID: ${SKILL_ID}`);
      const pipelineStart = Date.now();

      // ─── Turn 1: Plan ───
      onStatus("Planning your website design...");
      console.log("[CTW] Turn 1/3: Plan — sending creative brief request...");

      const planPrompt = buildPlanPrompt(businessInfo, designTokens, extractedContent);
      console.log(`[CTW] Plan prompt length: ~${Math.round(planPrompt.length / 4)} tokens`);
      const messages: Anthropic.Beta.Messages.BetaMessageParam[] = [
        { role: "user", content: planPrompt },
      ];

      let turnStart = Date.now();
      let response = await streamBetaMessage({
        ...SHARED_PARAMS,
        max_tokens: 4096, // Plan only needs a short creative brief
        container: { skills: SKILL_CONFIG },
        messages,
      });
      logUsage(`Turn 1 Plan (${elapsed(turnStart)})`, response);
      response = await handlePauseTurn(response, messages, undefined, "Turn 1 Plan");
      const containerId = response.container?.id;
      console.log(`[CTW] Container ID: ${containerId}`);

      // ─── Turn 2: Generate ───
      onStatus("Building your website...");
      console.log("[CTW] Turn 2/3: Generate — building HTML...");

      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: GENERATE_PROMPT });

      turnStart = Date.now();
      response = await streamBetaMessage({
        ...SHARED_PARAMS,
        max_tokens: 64000, // Full HTML output
        container: { id: containerId, skills: SKILL_CONFIG },
        messages,
      });
      logUsage(`Turn 2 Generate (${elapsed(turnStart)})`, response);
      response = await handlePauseTurn(response, messages, containerId, "Turn 2 Generate");

      const initialHtml = extractHtmlFromResponse(response);
      if (!initialHtml) {
        console.log("[CTW] ⚠ No HTML extracted from Generate response");
        const text = extractTextFromResponse(response);
        onChunk(text);
        return text;
      }

      console.log(`[CTW] Generated HTML: ${initialHtml.length} chars`);
      onChunk(initialHtml);

      // ─── Turn 3: Refine ───
      onStatus("Polishing and refining the design...");
      console.log("[CTW] Turn 3/3: Refine — polishing...");

      messages.push({ role: "assistant", content: response.content });

      // Try screenshots, fall back to text-based refinement
      let desktopScreenshot: string | null = null;
      let mobileScreenshot: string | null = null;
      try {
        console.log("[CTW] Taking screenshots (desktop + mobile)...");
        const ssStart = Date.now();
        const { takeScreenshot } = await import("./screenshot");
        [desktopScreenshot, mobileScreenshot] = await Promise.all([
          takeScreenshot(initialHtml, { width: 1280, height: 900 }),
          takeScreenshot(initialHtml, { width: 375, height: 812 }),
        ]);
        if (desktopScreenshot && mobileScreenshot) {
          console.log(`[CTW] Screenshots taken (${elapsed(ssStart)}) | desktop=${Math.round(desktopScreenshot.length / 1024)}KB mobile=${Math.round(mobileScreenshot.length / 1024)}KB`);
        } else {
          console.log(`[CTW] Screenshots returned null (${elapsed(ssStart)}), using text fallback`);
        }
      } catch (err) {
        console.log(`[CTW] Screenshots failed, using text fallback:`, err instanceof Error ? err.message : err);
      }

      if (desktopScreenshot && mobileScreenshot) {
        // Screenshot-based refinement
        messages.push({
          role: "user",
          content: [
            { type: "text", text: "Here is the desktop view of the website you generated:" },
            { type: "image", source: { type: "base64", media_type: "image/png", data: desktopScreenshot } },
            { type: "text", text: "Here is the mobile view:" },
            { type: "image", source: { type: "base64", media_type: "image/png", data: mobileScreenshot } },
            { type: "text", text: REFINE_PROMPT },
          ],
        });
      } else {
        console.log("[CTW] Using text-based refinement (no screenshots)");
        messages.push({
          role: "user",
          content: getTextRefinementPrompt(initialHtml),
        });
      }

      try {
        turnStart = Date.now();
        response = await streamBetaMessage({
          ...SHARED_PARAMS,
          max_tokens: 64000,
          container: { id: containerId, skills: SKILL_CONFIG },
          messages,
        });
        logUsage(`Turn 3 Refine (${elapsed(turnStart)})`, response);
        response = await handlePauseTurn(response, messages, containerId, "Turn 3 Refine");

        const refinedHtml = extractHtmlFromResponse(response);
        if (refinedHtml) {
          console.log(`[CTW] Refined HTML: ${refinedHtml.length} chars (${refinedHtml.length > initialHtml.length ? "+" : ""}${refinedHtml.length - initialHtml.length} vs initial)`);
          console.log(`[CTW] ═══ Pipeline complete (${elapsed(pipelineStart)}) ═══`);
          return refinedHtml;
        }
        console.log("[CTW] ⚠ No HTML extracted from Refine response, using initial");
      } catch (err) {
        console.error("[CTW] Refinement failed, using initial generation:", err);
      }

      console.log(`[CTW] ═══ Pipeline complete (${elapsed(pipelineStart)}) ═══`);
      return initialHtml;
    },
  };
}

/**
 * Fallback pipeline when no SKILL_ID is set.
 * Combines plan + generate into a single Opus call, then refines.
 */
async function runFallbackPipeline(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent: ExtractedContent | undefined,
  onChunk: (text: string) => void,
  onStatus: (status: string) => void,
): Promise<string> {
  onStatus("Designing your website...");

  const planPrompt = buildPlanPrompt(businessInfo, designTokens, extractedContent);
  const combinedPrompt = `${planPrompt}\n\nSkip the creative brief — go straight to building the complete website.\n\n${GENERATE_PROMPT}`;

  let initialHtml = "";
  const stream = anthropic.messages.stream({
    model: OPUS_MODEL,
    max_tokens: 64000,
    messages: [{ role: "user", content: combinedPrompt }],
  });

  stream.on("text", (text) => {
    initialHtml += text;
    onChunk(text);
  });

  await stream.finalMessage();

  initialHtml = initialHtml.trim();
  if (initialHtml.startsWith("```")) {
    initialHtml = initialHtml.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
  }

  // Refine pass
  onStatus("Polishing and refining the design...");

  try {
    const refinedMessage = await anthropic.messages.create({
      model: OPUS_MODEL,
      max_tokens: 64000,
      messages: [
        { role: "user", content: combinedPrompt },
        { role: "assistant", content: initialHtml },
        { role: "user", content: getTextRefinementPrompt(initialHtml) },
      ],
    });

    let refinedHtml = "";
    for (const block of refinedMessage.content) {
      if (block.type === "text") refinedHtml += block.text;
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
