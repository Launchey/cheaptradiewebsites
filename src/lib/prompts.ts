import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent } from "./types";
import { TRADE_TESTIMONIALS } from "./constants";

/**
 * Build the Plan prompt (Turn 1 of the Opus conversation).
 * Contains ALL static instructions + ALL dynamic data.
 * Everything here gets cached for Turns 2 and 3.
 */
export function buildPlanPrompt(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
): string {
  const hasRealTestimonials = extractedContent?.testimonials && extractedContent.testimonials.length > 0;
  const testimonials = hasRealTestimonials
    ? extractedContent!.testimonials!
    : TRADE_TESTIMONIALS[businessInfo.tradeType] || TRADE_TESTIMONIALS.other;

  const services = (extractedContent?.services && extractedContent.services.length > businessInfo.services.length)
    ? extractedContent.services
    : businessInfo.services;

  const serviceList = services.slice(0, 12).map((s) => `"${s}"`).join(", ");

  let extractedSection = "";
  if (extractedContent) {
    extractedSection = `
### Extracted Content (from existing website — crawled multiple pages)

${extractedContent.rawText ? `ORIGINAL WEBSITE TEXT — preserve their authentic voice:
${extractedContent.rawText}` : ""}

${extractedContent.logoUrl ? `LOGO — Use this actual image in the header:
${extractedContent.logoUrl}` : ""}

${extractedContent.heroImageUrl ? `HERO IMAGE — Use this actual image as the hero background:
${extractedContent.heroImageUrl}` : ""}

${extractedContent.images.length > 0 ? `IMAGES — Use these REAL image URLs from their website (as <img> tags or CSS background-image):
${extractedContent.images.slice(0, 20).map((img) => `- [${img.type}] ${img.src} (alt: "${img.alt || "image"}")`).join("\n")}` : ""}

${extractedContent.projects && extractedContent.projects.length > 0 ? `PROJECTS — Real projects from their website (include a projects/portfolio section):
${extractedContent.projects.map((p) => `- ${p.title}: ${p.description}${p.imageUrl ? ` | Image: ${p.imageUrl}` : ""}`).join("\n")}` : ""}

${extractedContent.socialLinks && extractedContent.socialLinks.length > 0 ? `SOCIAL MEDIA (include in footer):
${extractedContent.socialLinks.map((s) => `- ${s.platform}: ${s.url}`).join("\n")}` : ""}
`;
  }

  let designSystemSection = "";
  if (designTokens.cssDesignSystem) {
    designSystemSection = `
### Reference Design System
<reference_design_system>
${designTokens.cssDesignSystem}
</reference_design_system>

Apply this design system:
- Map the reference palette to the tradie's brand
- Match typography scale, spacing, shadows, transitions
- Follow the same layout structures and responsive approach
`;
  }

  return `## STATIC INSTRUCTIONS

### Rendering Target
- Single self-contained HTML file, all CSS and JS inline
- Google Fonts via <link> and customer image URLs are the ONLY allowed external resources
- Vanilla HTML5, CSS3, JavaScript ES2020+
- CSS Grid, Flexbox, clamp(), @keyframes, IntersectionObserver
- Inline SVGs for all icons
- NO frameworks, NO external libraries, NO CDN resources

### Image Rules
- USE the real image URLs from the customer's website (logo, hero, projects, gallery)
- The hero section MUST use the provided hero image URL as a background or <img>
- The header MUST include the customer's logo if one was provided
- Project/gallery images should use the real URLs provided
- For any section where no real image exists, use CSS gradients or patterns as placeholders

### Colour Rules — CRITICAL
- Use ONLY the colours from the Design Tokens below. These were extracted from the reference website.
- NEVER introduce purple, violet, or any colour not in the provided palette.
- If you need additional shades, derive them from the provided colours (lighter/darker variants).
- The reference website's colour scheme must be followed strictly.

### Content Requirements
- NZ English spelling throughout
- Phone numbers prominent and clickable (tel: links)
- Emails use mailto: links
- ONLY include services that are listed in the extracted data. NEVER hallucinate services.
- Each service gets a unique inline SVG icon with real description
- Footer MUST include: Website by CheapTradieWebsites.co.nz link
- Write as this tradie — confident, authentic, local NZ voice

### Output Rules
- Return ONLY raw HTML starting with <!DOCTYPE html>
- No markdown, no code fences, no explanation before or after

## DYNAMIC DATA

### Business Details
- Business Name: ${businessInfo.businessName}
- Trade Type: ${businessInfo.tradeType}
- Location: ${businessInfo.location}, ${businessInfo.region}
- Phone: ${businessInfo.phone}
- Email: ${businessInfo.email}
- Services: ${serviceList}${services.length > 12 ? ` (plus ${services.length - 12} more)` : ""}
- About: ${businessInfo.aboutText}
${businessInfo.tagline ? `- Tagline: "${businessInfo.tagline}"` : `- Create a memorable tagline for a ${businessInfo.tradeType} in ${businessInfo.region}`}
${businessInfo.yearsExperience ? `- Years of Experience: ${businessInfo.yearsExperience}` : ""}
${extractedSection}${designSystemSection}
### Design Tokens
- Primary: ${designTokens.colors.primary}
- Secondary: ${designTokens.colors.secondary}
- Accent: ${designTokens.colors.accent}
- Background: ${designTokens.colors.background}
- Text: ${designTokens.colors.text}
- Heading font: ${designTokens.fonts.heading}
- Body font: ${designTokens.fonts.body}
- Style: ${designTokens.style}

### Testimonials${hasRealTestimonials ? " (real quotes from their existing website — use verbatim)" : ""}
${testimonials!.map((t: { text: string; name: string; location?: string }, i: number) => `${i + 1}. "${t.text}" — ${t.name}${t.location ? `, ${t.location}` : ""}`).join("\n")}

## YOUR TASK (Turn 1)
Create a creative brief for this website. Define:
1. Aesthetic direction and mood
2. Layout structure (section order, visual flow)
3. Colour mapping (reference palette → tradie's brand)
4. Font pairing and typography scale
5. Key design moments (hero treatment, card style, scroll animations)
6. What makes this design distinctive and memorable

Be specific. This brief guides the build in the next turn.`;
}

/**
 * Generate prompt (Turn 2). Short — all context is cached from Turn 1.
 */
export const GENERATE_PROMPT = `Execute your creative brief. Build the complete website now.

Remember:
- Single HTML file starting with <!DOCTYPE html>
- All CSS and JS inline
- Self-critique your output before returning — check for generic patterns,
  missing animations, weak typography, flat backgrounds
- IMPORTANT: When you are finished, you MUST print the complete final HTML to stdout
  using print() or cat. The stdout output is how we capture the result.
  Do NOT just write it to a file — you must print it.
- No markdown, no code fences, no explanation`;

/**
 * Refine prompt (Turn 3). Sent alongside desktop + mobile screenshots.
 */
export const REFINE_PROMPT = `Review the desktop and mobile screenshots above against your creative brief
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
IMPORTANT: Print the final HTML to stdout using print() or cat so we can capture it.
No commentary, no markdown.`;

/**
 * Text-based refine prompt fallback when screenshots are unavailable.
 */
export function getTextRefinementPrompt(html: string): string {
  return `You generated the website below. Now review it critically against the frontend-design skill guidelines and fix everything that looks generic, template-y, or "AI-generated."

<generated_website>
${html}
</generated_website>

${REFINE_PROMPT}`;
}
