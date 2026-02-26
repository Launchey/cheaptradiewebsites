import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent } from "./types";
import { TRADE_TESTIMONIALS } from "./constants";

export function getSystemPrompt(): string {
  return `This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

---

## Application Context

You are building premium websites for New Zealand trade businesses (tradies). Each website must be:
- A single, complete, self-contained HTML file with inline CSS and JavaScript
- Production-ready, not a template or wireframe
- Visually striking and unique to the specific trade and business

ABSOLUTE RULES:
- Return ONLY the raw HTML starting with <!DOCTYPE html>. No markdown, no code fences, no explanation.
- ZERO references to AI, Claude, Anthropic, "AI-generated", "AI-powered" anywhere.
- NZ English spelling: colour, specialise, organisation, centre, analyse, etc.
- All visual placeholders use CSS gradients, SVG patterns, or decorative elements — NEVER broken image links.
- Only external dependency: Google Fonts via <link> tag

## Technical Requirements

Include in <head>:
- <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1.0">
- <title>, <meta name="description">
- Open Graph meta tags (og:title, og:description, og:type, og:locale=en_NZ)
- Google Fonts <link> for both heading and body fonts
- LocalBusiness JSON-LD structured data

CSS: Use :root custom properties for all colours, fonts, spacing, shadows, transitions, and radii.

Include CSS reset: *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

## Required Sections (7 minimum)

1. NAVIGATION — Fixed/sticky, transparent at top → glass effect on scroll (backdrop-filter blur). Logo left, nav links, phone tel: link, "Get a Free Quote" CTA button. Mobile hamburger with animated toggle + fullscreen overlay.

2. HERO — Full viewport (min-height: 100vh). Layered CSS gradient background + SVG pattern overlay at low opacity. Small uppercase label, large display heading (clamp sizing), supporting paragraph, two CTAs, prominent phone number, animated scroll indicator.

3. SERVICES — Section label + decorative accent. Grid of service cards with unique inline SVG icons per service, hover effects (lift + shadow), staggered reveal animations.

4. ABOUT — Asymmetric editorial layout (text + visual element). Business story, trust badges ("Licensed & Insured", "Free Quotes", "Local to [Region]"), optional stats row with animated counters.

5. TESTIMONIALS — Warm background. 3 cards with decorative quote marks, star ratings, customer name + location. Staggered reveal.

6. CONTACT FORM — Split layout: contact info with clickable tel:/mailto: links + styled form (Name, Phone, Email, Message, Submit). Focus states, "We'll get back to you within 24 hours."

7. FOOTER — Dark background. Business info, quick links, contact info, social icons if provided. Copyright with current year. MUST include: <a href="https://cheaptradiewebsites.co.nz">Website by CheapTradieWebsites.co.nz</a>

## Required JavaScript (end of body)

- IntersectionObserver for scroll-reveal animations
- Nav scroll detection (transparent → scrolled class)
- Mobile menu toggle (hamburger ↔ X, body overflow hidden)
- Animated counters for stats (data-target attribute)
- Form submission handler (preventDefault + thank you message)
- Smooth scroll for anchor links

## Quality Standard

Every website must have: 900+ lines, 7+ sections, 10+ unique SVG icons, working mobile menu, glass nav, scroll animations, hover effects on all interactive elements, responsive at 375/768/1200px.`;
}

export function getUserPrompt(
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

  let extractedSection = "";
  if (extractedContent) {
    extractedSection = `
EXTRACTED CONTENT FROM EXISTING WEBSITE:
This tradie has an existing website. Use their real content — their words, their services, their story. Preserve their authentic voice.

${extractedContent.rawText ? `ORIGINAL WEBSITE TEXT:
${extractedContent.rawText}` : ""}

${extractedContent.images.length > 0 ? `IMAGES (create CSS gradient/pattern visual placeholders inspired by these — do NOT use the URLs):
${extractedContent.images.slice(0, 6).map((img) => `- [${img.type}] ${img.alt || "image"}`).join("\n")}` : ""}

${extractedContent.socialLinks && extractedContent.socialLinks.length > 0 ? `SOCIAL MEDIA (include in footer):
${extractedContent.socialLinks.map((s) => `- ${s.platform}: ${s.url}`).join("\n")}` : ""}
`;
  }

  const serviceList = services.slice(0, 12).map((s) => `"${s}"`).join(", ");

  return `Build a premium, distinctive website for this New Zealand trade business:

BUSINESS:
- Name: ${businessInfo.businessName}
- Trade: ${businessInfo.tradeType}
- Location: ${businessInfo.location}, ${businessInfo.region}
- Phone: ${businessInfo.phone}
- Email: ${businessInfo.email}
- Services: ${serviceList}${services.length > 12 ? ` (plus ${services.length - 12} more)` : ""}
- About: ${businessInfo.aboutText}
${businessInfo.tagline ? `- Tagline: "${businessInfo.tagline}"` : `- Create a tagline: punchy, memorable, authentic for a ${businessInfo.tradeType} in ${businessInfo.region}`}
${businessInfo.yearsExperience ? `- Experience: ${businessInfo.yearsExperience} years` : ""}
${extractedSection}
DESIGN TOKENS:
- Colours: primary ${designTokens.colors.primary}, secondary ${designTokens.colors.secondary}, accent ${designTokens.colors.accent}, background ${designTokens.colors.background}, text ${designTokens.colors.text}
- Heading font: ${designTokens.fonts.heading}
- Body font: ${designTokens.fonts.body}
- Style: ${designTokens.style}
- Layout patterns: ${designTokens.layoutPatterns.join(", ")}

TESTIMONIALS${hasRealTestimonials ? " (real, from their website)" : ""}:
${testimonials!.map((t: { text: string; name: string; location?: string }, i: number) => `${i + 1}. "${t.text}" — ${t.name}${t.location ? `, ${t.location}` : ""}`).join("\n")}

Write compelling, authentic copy as if you are this tradie. Reference ${businessInfo.location} and ${businessInfo.region} naturally. Make the phone number ${businessInfo.phone} prominent and clickable everywhere.
${extractedContent ? "\nPRESERVE their real content from the extracted website — about text, services, testimonials must appear faithfully." : ""}

Return ONLY the complete HTML. Start with <!DOCTYPE html>.`;
}
