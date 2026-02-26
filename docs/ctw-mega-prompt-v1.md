# CTW Mega Prompt v1 — Agent Skills API Architecture

> CheapTradieWebsites generation pipeline using Anthropic's Agent Skills API with prompt caching best practices.

---

## Models

| Step | Model | Purpose |
|------|-------|---------|
| Analyse | Claude Sonnet 4.6 (`claude-sonnet-4-6`) | Extract design tokens + CSS system from reference URL |
| Extract | Claude Sonnet 4.6 (`claude-sonnet-4-6`) | Extract business content from tradie's existing website |
| Plan | Claude Opus 4.6 (`claude-opus-4-6`) | Creative brief — aesthetic direction, layout, font pairings, colour mapping |
| Generate | Claude Opus 4.6 (`claude-opus-4-6`) | Build the website using the frontend-design skill + plan + extracted data |
| Refine | Claude Opus 4.6 (`claude-opus-4-6`) | Visual review (desktop + mobile screenshots) + self-critique and polish |

Never use Claude Sonnet 4 for anything. Only Opus 4.6 and Sonnet 4.6.

**Execution:** Analyse + Extract run in parallel (independent Sonnet calls). Plan → Generate → Refine run as a single multi-turn Opus conversation (cache-optimised).

**User input:** A reference URL (design they like) + their existing website URL (we extract everything). If no existing website: just business name (AI generates the rest during Plan).

---

## Agent Skills API

Skills integrate with the Messages API through the code execution tool. You specify skills in the `container` parameter, and they execute in the code execution environment.

### Prerequisites

1. **Claude API key**
2. **Beta headers (all three required):**
   - `code-execution-2025-08-25` — Enables code execution (required for Skills)
   - `skills-2025-10-02` — Enables Skills API
   - `files-api-2025-04-14` — Required for file upload/download to/from container
3. **Code execution tool** enabled in requests
4. **`cache_control: { type: "ephemeral" }`** at top level for automatic caching

### How Skills Are Loaded

When you specify Skills in a container:
1. **Metadata Discovery** — Claude sees metadata for each Skill (name, description) in the system prompt
2. **File Loading** — Skill files are copied into the container at `/skills/{directory}/`
3. **Automatic Use** — Claude automatically loads and uses Skills when relevant to the request

The progressive disclosure architecture ensures efficient context usage: Claude only loads full Skill instructions when needed. You do NOT duplicate skill content in prompts.

### Container Parameter Shape

This is the template all Opus turns share — only `messages` and `max_tokens` change between turns:

```typescript
const response = await anthropic.beta.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 64000,
  betas: ["code-execution-2025-08-25", "skills-2025-10-02", "files-api-2025-04-14"],
  cache_control: { type: "ephemeral" },
  container: {
    skills: [{
      type: "custom",
      skill_id: SKILL_ID,
      version: "latest",
    }]
  },
  messages: [{ role: "user", content: userPrompt }],
  tools: [{ type: "code_execution_20250825", name: "code_execution" }],
});
```

### pause_turn Handling

The skill may need multiple API roundtrips to complete. The API signals this with `pause_turn` as the stop reason. Container, skills, tools, model must stay identical to preserve cache:

```typescript
let messages: Anthropic.Beta.Messages.BetaMessageParam[] = [
  { role: "user", content: userPrompt }
];

let response = await anthropic.beta.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 64000,
  betas: ["code-execution-2025-08-25", "skills-2025-10-02", "files-api-2025-04-14"],
  cache_control: { type: "ephemeral" },
  container: {
    skills: [{ type: "custom", skill_id: SKILL_ID, version: "latest" }]
  },
  messages,
  tools: [{ type: "code_execution_20250825", name: "code_execution" }],
});

for (let i = 0; i < 10; i++) {
  if (response.stop_reason !== "pause_turn") break;

  messages.push({ role: "assistant", content: response.content });

  response = await anthropic.beta.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 64000,
    betas: ["code-execution-2025-08-25", "skills-2025-10-02", "files-api-2025-04-14"],
    cache_control: { type: "ephemeral" },
    container: {
      id: response.container.id,
      skills: [{ type: "custom", skill_id: SKILL_ID, version: "latest" }]
    },
    messages,
    tools: [{ type: "code_execution_20250825", name: "code_execution" }],
  });
}
```

### Multi-Turn Conversation (Plan → Generate → Refine)

All 3 Opus turns share identical parameters. Only messages grow. Container ID reused from Turn 1 onward. Automatic caching means the growing prefix is cached between turns.

```typescript
const SHARED_PARAMS = {
  model: "claude-opus-4-6" as const,
  betas: ["code-execution-2025-08-25", "skills-2025-10-02", "files-api-2025-04-14"],
  cache_control: { type: "ephemeral" as const },
  tools: [{ type: "code_execution_20250825" as const, name: "code_execution" }],
};

const SKILL_CONFIG = [
  { type: "custom" as const, skill_id: SKILL_ID, version: "latest" }
];

// ─── Turn 1: Plan ───
// Contains ALL static instructions + ALL dynamic data.
// Everything here gets cached for Turns 2 and 3.

const planPrompt = buildPlanPrompt({
  businessInfo,      // extracted from existing website, or just businessName + AI fills rest
  designTokens,      // from Sonnet analyse step
  cssDesignSystem,   // from Sonnet analyse step
  extractedContent,  // from Sonnet extract step (may be null)
});

let messages: Message[] = [{ role: "user", content: planPrompt }];

let response = await anthropic.beta.messages.create({
  ...SHARED_PARAMS,
  max_tokens: 4096,  // Plan only needs a short creative brief
  container: { skills: SKILL_CONFIG },
  messages,
});
response = await handlePauseTurn(response, messages);
const containerId = response.container.id;

// ─── Turn 2: Generate ───
// Short prompt — all context is cached from Turn 1.

messages.push({ role: "assistant", content: response.content });
messages.push({ role: "user", content: GENERATE_PROMPT });

response = await anthropic.beta.messages.create({
  ...SHARED_PARAMS,
  max_tokens: 64000,  // Full HTML output
  container: { id: containerId, skills: SKILL_CONFIG },
  messages,
});
response = await handlePauseTurn(response, messages);

// ─── Extract HTML from response ───
const initialHtml = extractHtmlFromResponse(response);
if (!initialHtml) {
  return extractTextFromResponse(response);
}

// ─── Server takes screenshots ───
const [desktopScreenshot, mobileScreenshot] = await Promise.all([
  takeScreenshot(initialHtml, { width: 1280, height: 900 }),
  takeScreenshot(initialHtml, { width: 375, height: 812 }),
]);

// ─── Turn 3: Refine ───
// Screenshots + critique checklist appended to conversation.

messages.push({ role: "assistant", content: response.content });
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

response = await anthropic.beta.messages.create({
  ...SHARED_PARAMS,
  max_tokens: 64000,
  container: { id: containerId, skills: SKILL_CONFIG },
  messages,
});
response = await handlePauseTurn(response, messages);

const refinedHtml = extractHtmlFromResponse(response);
return refinedHtml || initialHtml;  // Fallback to initial if refinement fails
```

### Prompt Caching Rules

Rules 1-6 are enforced by `SHARED_PARAMS` and the code structure above. Additional rules:

1. **Automatic caching** via top-level `cache_control: { type: "ephemeral" }` — no beta header needed, caching is GA.
2. **5-minute cache TTL** — all 3 turns must complete within this window.
3. **Minimum cacheable length:** 4096 tokens for Opus, 1024 tokens for Sonnet. Our Turn 1 prompt easily exceeds both.

---

## Prompts

### Plan Prompt (Turn 1)

Contains ALL static instructions + ALL dynamic data. Everything here gets cached for Turns 2 and 3.

```
## STATIC INSTRUCTIONS

### Rendering Target
- Single self-contained HTML file, all CSS and JS inline
- Google Fonts via <link> (ONLY allowed external resource)
- Vanilla HTML5, CSS3, JavaScript ES2020+
- CSS Grid, Flexbox, clamp(), @keyframes, IntersectionObserver
- Inline SVGs for all icons
- NO frameworks, NO external libraries, NO CDN resources

### Content Requirements
- NZ English spelling throughout
- Phone numbers prominent and clickable (tel: links)
- Emails use mailto: links
- Each service gets a unique inline SVG icon with real description
- Footer MUST include: Website by CheapTradieWebsites.co.nz link
- Write as this tradie — confident, authentic, local NZ voice

### Output Rules
- Return ONLY raw HTML starting with <!DOCTYPE html>
- No markdown, no code fences, no explanation before or after

## DYNAMIC DATA

### Business Details
- Business Name: {businessName}
- Trade Type: {tradeType}
- Location: {location}, {region}
- Phone: {phone}
- Email: {email}
- Services: {services}
- About: {aboutText}
[All extracted from existing website. If unavailable, AI-generated based on businessName and tradeType.]

### Extracted Content (from existing website)
{rawText — the tradie's real words, preserve their voice}
{socialLinks — include in footer}
{testimonials — use verbatim if available}

### Reference Design System
<reference_design_system>
{cssDesignSystem — full prose specification from Sonnet analyse step}
</reference_design_system>

Apply this design system:
- Map the reference palette to the tradie's brand
- Match typography scale, spacing, shadows, transitions
- Follow the same layout structures and responsive approach

### Design Tokens
- Primary: {primary}
- Secondary: {secondary}
- Accent: {accent}
- Background: {background}
- Text: {text}
- Heading font: {heading}
- Body font: {body}
- Style: {style}

## YOUR TASK (Turn 1)
Create a creative brief for this website. Define:
1. Aesthetic direction and mood
2. Layout structure (section order, visual flow)
3. Colour mapping (reference palette → tradie's brand)
4. Font pairing and typography scale
5. Key design moments (hero treatment, card style, scroll animations)
6. What makes this design distinctive and memorable

Be specific. This brief guides the build in the next turn.
```

### Generate Prompt (Turn 2)

Short — all context is cached from Turn 1.

```
Execute your creative brief. Build the complete website now.

Remember:
- Single HTML file starting with <!DOCTYPE html>
- All CSS and JS inline
- Self-critique your output before returning — check for generic patterns,
  missing animations, weak typography, flat backgrounds
- No markdown, no code fences, no explanation
```

### Refine Prompt (Turn 3)

Sent alongside desktop + mobile screenshots.

```
Review the desktop and mobile screenshots above against your creative brief
and the frontend-design skill guidelines.

Fix everything that looks:
- Generic, template-y, or "AI-generated"
- Broken in the mobile view
- Misaligned, overlapping, or poorly spaced
- Missing hover states, animations, or visual depth

Specific checklist:
1. Typography — distinctive fonts, clear hierarchy, letter-spacing on uppercase
2. Colour & Depth — bold palette, layered backgrounds, hero has depth
3. Layout — asymmetry, visual tension, editorial sections
4. Motion — scroll reveals with stagger, card hover effects, nav scroll change
5. SVG Icons — unique per service, actually representative
6. Mobile — hamburger works, layout stacks, touch targets sized correctly
7. Content — sections substantial, descriptions real, copy authentic NZ voice
8. Details — decorative elements, focus states, active nav states

Output the COMPLETE improved HTML. Start with <!DOCTYPE html>.
No commentary, no markdown.
```

---

## Batch 1: Parallel Sonnet 4.6 Calls

Two independent calls run in parallel before the Opus conversation starts. Standard API — no skills, no container, no code execution. No caching relationship between them.

### Analyse (design extraction)

- **Input:** Reference URL's HTML (head content, all CSS blocks, body snippet)
- **Output:** `ExtractedDesignTokens` with structured colours/fonts/style + `cssDesignSystem` prose specification
- Two parallel sub-calls:
  - A: Structured design tokens as JSON (colours, fonts, style, layout patterns)
  - B: Full CSS design system specification as prose (12-point spec covering every CSS value)

### Extract (content extraction)

- **Input:** Tradie's existing website HTML + detected image URLs
- **Output:** `ExtractedContent` with businessName, tradeType, location, phone, email, services, testimonials, socialLinks, aboutText, rawTextSummary
- If no existing website provided: user supplies business name only. AI generates all other content during the Opus Plan turn.

---

## Screenshot Service

After Turn 2 (Generate), the server renders the HTML and takes screenshots for visual review in Turn 3 (Refine).

- **Desktop screenshot:** 1280px × 900px viewport
- **Mobile screenshot:** 375px × 812px viewport
- **Technology:** Puppeteer with `@sparticuz/chromium` (headless Chrome for Vercel serverless)
- Screenshots sent as base64 image content blocks in the Turn 3 user message
- The code execution container cannot render HTML — screenshots must be taken server-side
