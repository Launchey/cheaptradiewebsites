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

## Rendering Target

You are generating a **single, self-contained HTML file** with all CSS and JavaScript inline. This is what's available:

**Available:**
- Vanilla HTML5, CSS3, and JavaScript (ES2020+)
- Google Fonts via <link> tag (the ONLY allowed external resource)
- CSS custom properties, CSS Grid, Flexbox, clamp(), CSS animations, @keyframes
- backdrop-filter, mix-blend-mode, clip-path, CSS gradients (linear, radial, conic)
- Inline SVGs for all icons and decorative elements
- IntersectionObserver, requestAnimationFrame, Web Animations API
- CSS :has(), :is(), :where() selectors
- CSS scroll-snap, scroll-behavior: smooth
- Media queries for responsive design

**NOT available (do not use):**
- No Tailwind, no Bootstrap, no external CSS frameworks
- No React, Vue, or any JavaScript framework
- No external JavaScript libraries
- No external images or CDN resources (except Google Fonts)
- No npm packages

**Output format:**
- Return ONLY raw HTML starting with <!DOCTYPE html>
- No markdown wrapping, no code fences, no explanation before or after
- The entire website is one .html file

## Anti-Patterns to Avoid

These are specific things that make AI-generated websites look generic. NEVER do any of these:

**Layout anti-patterns:**
- Perfectly symmetrical layouts with no visual tension
- Every section using the same padding, same width, same structure
- Cards in a boring 3-column grid with identical spacing
- Hero section that's just centred text on a flat gradient
- Sections that are all white or all the same background colour

**Typography anti-patterns:**
- Using only one font weight throughout
- Headings that are all the same size
- No text hierarchy (everything feels the same importance)
- Missing letter-spacing on uppercase labels
- Line heights that are too tight or too loose
- Generic font choices: Arial, Helvetica, Inter, Roboto, Open Sans, Lato, system-ui

**Colour anti-patterns:**
- Purple-on-white gradients (the ultimate AI cliché)
- Using the primary colour for everything with no variation
- Flat solid backgrounds with no texture or depth
- Accent colour used so sparingly it doesn't register
- Grey text on white that's too low contrast to read

**Motion anti-patterns:**
- No animations at all (static, lifeless pages)
- Everything animating at once on page load
- Only opacity transitions with no transform component
- Missing hover states on interactive elements
- No scroll-triggered animations

**Component anti-patterns:**
- Cards with no hover effect
- Buttons that look like default browser buttons
- Form inputs with no focus styling
- Navigation that doesn't change on scroll
- No mobile menu (or a broken one)
- "Image placeholder" text instead of CSS-generated visuals
- Sparse sections with one sentence of content

## What GOOD Looks Like

- Hero: full viewport, layered backgrounds (gradient + subtle pattern + radial glow), dramatic typography with tight leading, well-spaced CTAs
- Cards: generous padding (32px+), subtle shadows that deepen on hover, icons that aren't generic, staggered reveal on scroll
- About: editorial asymmetric layout (not centred), overlapping elements, stats with counter animations
- Nav: glass-morphism on scroll, animated hamburger, smooth transitions
- Typography: distinctive display font for headings paired with a refined body font, clear hierarchy from h1 (4rem) down to body (1.1rem)
- Colour: dominant + accent approach, sections with alternating warm/cool backgrounds, dark footer
- Motion: staggered scroll reveals (each card delayed 100ms after the previous), hover transforms + shadow changes, counters that animate up`;
}

export function getRefinementPrompt(html: string): string {
  return `You generated the website below. Now review it critically against the frontend-design skill guidelines and fix everything that looks generic, template-y, or "AI-generated."

<generated_website>
${html}
</generated_website>

## Self-Critique Checklist

Review and fix ALL of these:

1. **Typography** — Are the fonts distinctive and characterful, or generic? Is there a clear hierarchy from display headings down to body text? Is letter-spacing used on uppercase labels? Are line-heights correct (tight on headings ~1.1, generous on body ~1.7)?

2. **Colour & Depth** — Is the palette bold with a dominant colour and sharp accent? Are backgrounds layered (gradient + pattern + glow) or just flat? Does the hero have depth? Do sections alternate background colours/tones?

3. **Layout & Composition** — Is there any asymmetry or visual tension, or is everything perfectly centred and predictable? Does the about section use an editorial split layout? Are there any grid-breaking or overlapping elements?

4. **Motion** — Do elements have scroll-reveal animations with staggered delays? Do cards lift and change shadow on hover? Do buttons have hover transforms? Does the nav change on scroll? Are there counter animations on stats?

5. **SVG Icons** — Does every service have a UNIQUE, detailed inline SVG icon? Are the icons just generic circles/squares or actually representative of the service?

6. **Backgrounds** — Does the hero have layers (gradient + SVG pattern overlay at 3-5% opacity + radial glow)? Is there a grain/noise texture anywhere? Do testimonials have a warm differentiated background?

7. **Mobile** — Is there a working hamburger menu with animated toggle? Does the layout stack properly? Are touch targets large enough?

8. **Content** — Is every section substantial (not sparse)? Are service descriptions real and specific (not one-liners)? Is the copy authentic and local?

9. **Details** — Are there decorative elements (accent lines, geometric shapes, quote marks)? Focus states on form inputs? Active/current states on nav links?

For each issue you find, fix it directly. Then output the COMPLETE improved HTML file.

Rules:
- Output ONLY the improved HTML. No commentary, no markdown, no explanation.
- Start with <!DOCTYPE html>
- Fix everything, don't just tweak one or two things
- Make it look like a $5,000 agency website, not a template`;
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
## EXTRACTED CONTENT FROM EXISTING WEBSITE

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

  let designSystemSection = "";
  if (designTokens.cssDesignSystem) {
    designSystemSection = `
## REFERENCE WEBSITE — COMPLETE CSS DESIGN SYSTEM

The user provided a reference website they want their new website to look like. Below is the complete design system extracted from that reference. Use this as your primary design guide — replicate the look, feel, spacing, typography, colours, shadows, animations, and overall aesthetic.

<reference_design_system>
${designTokens.cssDesignSystem}
</reference_design_system>

Apply this design system:
- Map the reference colour palette to the tradie's brand colours
- Use the same typography scale, font weights, and spacing
- Replicate the shadow and depth treatment
- Copy the button styles, hover effects, and transition timings
- Match the background treatments and section rhythm
- Follow the same layout structures and responsive approach
- The tradie's website should look like it was designed by the same designer
`;
  }

  const tokenSection = `
## DESIGN TOKENS

Colour palette:
- Primary: ${designTokens.colors.primary}
- Secondary: ${designTokens.colors.secondary}
- Accent/CTA: ${designTokens.colors.accent}
- Background: ${designTokens.colors.background}
- Text: ${designTokens.colors.text}

Typography:
- Heading font: ${designTokens.fonts.heading} (import from Google Fonts)
- Body font: ${designTokens.fonts.body} (import from Google Fonts)

Style direction: ${designTokens.style}
Layout patterns: ${designTokens.layoutPatterns.join(", ")}
`;

  return `Build a premium, production-grade website for this New Zealand trade business.

## BUSINESS DETAILS

- Business Name: ${businessInfo.businessName}
- Trade Type: ${businessInfo.tradeType}
- Location: ${businessInfo.location}, ${businessInfo.region}
- Phone: ${businessInfo.phone}
- Email: ${businessInfo.email}
- Services: ${serviceList}${services.length > 12 ? ` (plus ${services.length - 12} more)` : ""}
- About: ${businessInfo.aboutText}
${businessInfo.tagline ? `- Tagline: "${businessInfo.tagline}"` : `- Create a memorable tagline for a ${businessInfo.tradeType} in ${businessInfo.region}`}
${businessInfo.yearsExperience ? `- Years of Experience: ${businessInfo.yearsExperience}` : ""}
${extractedSection}${designSystemSection}${tokenSection}
## TESTIMONIALS${hasRealTestimonials ? " (real quotes from their existing website — use verbatim)" : ""}

${testimonials!.map((t: { text: string; name: string; location?: string }, i: number) => `${i + 1}. "${t.text}" — ${t.name}${t.location ? `, ${t.location}` : ""}`).join("\n")}

## CONTENT REQUIREMENTS

- Write as if you ARE this tradie — confident, authentic, local NZ voice
- Reference ${businessInfo.location} and ${businessInfo.region} naturally throughout
- Make the phone number ${businessInfo.phone} prominent and clickable (tel: links) everywhere
- Every email uses mailto: links
- Each service needs its own card with a unique inline SVG icon and real description
- Footer MUST include: <a href="https://cheaptradiewebsites.co.nz">Website by CheapTradieWebsites.co.nz</a>
${extractedContent ? "- PRESERVE the tradie's real content from their existing website — about text, services, testimonials must appear faithfully." : ""}

## OUTPUT

Return ONLY the complete HTML file. Start with <!DOCTYPE html>. No markdown. No code fences. No explanation.`;
}
