import type { BusinessInfo, ExtractedDesignTokens, ExtractedContent } from "./types";
import { TRADE_TESTIMONIALS } from "./constants";

export function getSystemPrompt(): string {
  return `You are a world-class web designer who creates premium websites for New Zealand trade businesses. Your websites look like they cost $5,000+ from a professional agency. You NEVER produce generic, template-looking, or sparse websites.

You generate a single, complete, self-contained HTML file with inline CSS and minimal inline JavaScript. The output must be production-ready and visually stunning.

ABSOLUTE RULES:
- Return ONLY the raw HTML starting with <!DOCTYPE html>. No markdown, no explanation, no code fences, no commentary before or after the HTML.
- ZERO references to AI, Claude, Anthropic, "AI-generated", "AI-powered", or any AI branding.
- NZ English spelling: colour, specialise, organisation, centre, analyse, licence, etc.
- All images are CSS-based (gradients, SVG patterns, emoji) — NEVER broken image URLs or external images.
- The output MUST be a complete, working HTML page — not a fragment.

TECHNICAL FOUNDATION (include ALL of this in every website):

<style> must include this exact CSS reset and base:
\`\`\`css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font-body); color: var(--color-text); background: var(--color-bg); line-height: 1.7; overflow-x: hidden; }
img { max-width: 100%; display: block; }
a { text-decoration: none; color: inherit; transition: color 0.3s ease; }
\`\`\`

CSS Custom Properties (define in :root):
\`\`\`css
:root {
  --color-primary: [from tokens];
  --color-secondary: [from tokens];
  --color-accent: [from tokens];
  --color-bg: [from tokens];
  --color-text: [from tokens];
  --color-text-light: [derive lighter shade];
  --color-dark: [derive very dark shade for hero/footer];
  --color-dark-text: rgba(255,255,255,0.95);
  --color-dark-text-muted: rgba(255,255,255,0.65);
  --color-card-bg: #ffffff;
  --color-border: rgba(0,0,0,0.08);
  --font-heading: [from tokens], serif;
  --font-body: [from tokens], sans-serif;
  --max-width: 1200px;
  --section-padding: clamp(60px, 10vw, 120px);
  --card-radius: 12px;
  --btn-radius: 8px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
  --shadow-hover: 0 12px 48px rgba(0,0,0,0.15);
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
\`\`\`

REQUIRED <head> ELEMENTS:
- <meta charset="UTF-8">
- <meta name="viewport" content="width=device-width, initial-scale=1.0">
- <title>[Business Name] — [Trade Type] in [Location], [Region]</title>
- <meta name="description" content="...">
- Open Graph meta tags (og:title, og:description, og:type, og:locale=en_NZ, og:site_name)
- Google Fonts <link> for BOTH heading and body fonts (weights 400,500,600,700)
- LocalBusiness JSON-LD structured data script

MANDATORY JAVASCRIPT (include at end of body):
\`\`\`javascript
// Scroll-reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Sticky nav background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuBtn.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});
\`\`\`

MANDATORY CSS for animations:
\`\`\`css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s var(--transition), transform 0.8s var(--transition);
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }
\`\`\`

=== SECTION-BY-SECTION DESIGN SPECIFICATIONS ===

1. NAVIGATION (sticky, with glass effect)
CSS:
\`\`\`css
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 16px 0;
  background: transparent;
  transition: all 0.4s ease;
}
nav.scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 1px 20px rgba(0,0,0,0.06);
  padding: 12px 0;
}
\`\`\`
Structure:
- Logo/business name on left (font-heading, bold)
- Desktop nav links in center/right (font-weight 500, subtle hover underline effect)
- Phone number with tel: link visible on desktop (hidden on mobile)
- "Get a Free Quote" CTA button in nav
- Hamburger icon for mobile (animated 3-line to X transition)
- Mobile menu: fullscreen overlay with large centered links

2. HERO SECTION (full impact, trade-specific)
CSS:
\`\`\`css
.hero {
  min-height: 100vh;
  display: flex; align-items: center;
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, var(--color-dark) 0%, [darker shade] 100%);
}
.hero::before {
  content: ''; position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* geometric/trade SVG pattern */
  opacity: 0.04;
}
.hero::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(var(--accent-rgb), 0.15), transparent 70%);
}
\`\`\`
Content:
- Small uppercase label above heading (trade type + location, letter-spacing: 0.15em)
- Display heading: font-size clamp(2.5rem, 6vw, 4.5rem), font-weight 700, line-height 1.08
- Subheading paragraph: font-size 1.25rem, max-width 560px, opacity 0.8
- Two buttons side by side: primary (solid, bg accent) + secondary (outline/ghost)
- Phone number: prominent, large, with phone SVG icon
- Animated scroll-down chevron at bottom

3. SERVICES SECTION
- Section label: uppercase, letter-spacing 0.15em, small font, muted colour
- Thin accent line below label (40px wide, 2px tall, accent colour)
- Section heading: font-size clamp(2rem, 4vw, 3rem)
- Grid: 2-3 columns desktop (grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)))
- Each card:
  - Inline SVG icon (48x48, themed to the service, using stroke style)
  - Service name (font-heading, 1.25rem, bold)
  - 1-2 sentence description
  - Card CSS: background white, border-radius var(--card-radius), padding 32px, box-shadow var(--shadow-sm)
  - Hover: transform translateY(-4px), box-shadow var(--shadow-hover), transition 0.3s
- Add .reveal class with stagger delays

4. ABOUT SECTION
- Two-column layout (60/40 split)
- Left: about text with years/stats callouts
- Right: CSS gradient visual element (not an image placeholder — a styled gradient box with a pattern overlay or geometric shape)
- Trust badges row: "Licensed & Insured", "Free Quotes", "Local to [Region]" as styled pills/badges
- Stats row if years provided: "XX+ Years", "XXX+ Projects", "100% Satisfaction"

5. TESTIMONIALS SECTION
- Warm background colour (slightly different from other sections)
- 3 cards in a row, stack on mobile
- Each card: large opening quote mark (decorative, in accent colour), quote text (italic), customer name (bold), location, 5-star rating
- Cards have subtle background, rounded corners, gentle shadow

6. CONTACT / QUOTE FORM
- Two-column layout: info left, form right
- Left: heading, phone (large, clickable), email (clickable), service area, business hours if known
- Right: styled form with floating labels or clean label-above-input pattern
- Input styles: border 1px solid var(--color-border), border-radius 8px, padding 14px 16px, focus border-color var(--color-accent), focus ring
- Submit button: full-width, background var(--color-accent), colour white, padding 16px, font-weight 600, hover effect
- "We'll get back to you within 24 hours" below submit

7. FOOTER
- Dark background (var(--color-dark))
- Three columns: Brand info | Quick Links | Contact Info
- Business name in heading font
- All links clickable (tel:, mailto:)
- Social media icons if provided
- Copyright with current year (use JS: new Date().getFullYear())
- MUST include: <a href="https://cheaptradiewebsites.co.nz" style="opacity:0.5">Website by CheapTradieWebsites.co.nz</a>

=== DESIGN QUALITY CHECKLIST (the website MUST have ALL of these) ===
□ Minimum 7 complete sections with substantial content in each
□ Hero takes up full viewport height with gradient + pattern overlay
□ At least 6 service cards with unique SVG icons and descriptions
□ Working mobile hamburger menu with smooth animation
□ Every section has .reveal class for scroll animations
□ Navigation changes appearance on scroll (glass effect)
□ All phone numbers are clickable tel: links
□ All emails are clickable mailto: links
□ Form has proper input styling with focus states
□ Footer has the CheapTradieWebsites credit link
□ Total HTML output is 800+ lines (a premium website needs substance)
□ At least 10 unique inline SVG icons throughout the page
□ CSS gradients or patterns for all visual placeholders (never "image placeholder" text)
□ Typography uses both heading AND body fonts from Google Fonts
□ Every button has hover states with transitions
□ Responsive: looks perfect on mobile (375px), tablet (768px), and desktop (1200px+)`;
}

export function getUserPrompt(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens,
  extractedContent?: ExtractedContent
): string {
  // Use real testimonials from extraction, fall back to trade-specific defaults
  const hasRealTestimonials = extractedContent?.testimonials && extractedContent.testimonials.length > 0;
  const testimonials = hasRealTestimonials
    ? extractedContent!.testimonials!
    : TRADE_TESTIMONIALS[businessInfo.tradeType] || TRADE_TESTIMONIALS.other;

  // Use real services from extraction if available and richer than form data
  const services = (extractedContent?.services && extractedContent.services.length > businessInfo.services.length)
    ? extractedContent.services
    : businessInfo.services;

  // Build extracted content section
  let extractedSection = "";
  if (extractedContent) {
    extractedSection = `
EXTRACTED CONTENT FROM EXISTING WEBSITE:
The tradie already has a website. Below is content extracted from it. Use this real content in the new website — it's their actual business information, written in their own words. Preserve the tone and key details.

${extractedContent.rawText ? `ORIGINAL WEBSITE TEXT (preserve key messaging and tone):
${extractedContent.rawText}` : ""}

${extractedContent.images.length > 0 ? `IMAGES FROM EXISTING SITE (use as descriptions for CSS gradient placeholders and alt text context — do NOT use the URLs, create CSS-based visuals instead):
${extractedContent.images.slice(0, 6).map((img) => `- [${img.type}] ${img.alt || "untitled image"}`).join("\n")}` : ""}

${extractedContent.socialLinks && extractedContent.socialLinks.length > 0 ? `SOCIAL MEDIA LINKS (include icon links in the footer):
${extractedContent.socialLinks.map((s) => `- ${s.platform}: ${s.url}`).join("\n")}` : ""}
`;
  }

  // Build service descriptions for richer content
  const serviceList = services.slice(0, 8).map((s) => `"${s}"`).join(", ");

  return `Build a PREMIUM, COMPLETE website for this New Zealand trade business. This must look like a $5,000+ agency-built website.

BUSINESS DETAILS:
- Business Name: ${businessInfo.businessName}
- Trade Type: ${businessInfo.tradeType}
- Location: ${businessInfo.location}, ${businessInfo.region}
- Phone: ${businessInfo.phone}
- Email: ${businessInfo.email}
- Services: ${serviceList}${services.length > 8 ? ` (and ${services.length - 8} more)` : ""}
- About: ${businessInfo.aboutText}
${businessInfo.tagline ? `- Tagline: "${businessInfo.tagline}"` : `- Create a tagline: Write a short, punchy, memorable tagline for a ${businessInfo.tradeType} in ${businessInfo.region}`}
${businessInfo.yearsExperience ? `- Years Experience: ${businessInfo.yearsExperience}` : ""}
${extractedSection}
COLOUR PALETTE (use as CSS custom properties):
- --color-primary: ${designTokens.colors.primary}
- --color-secondary: ${designTokens.colors.secondary}
- --color-accent: ${designTokens.colors.accent}
- --color-bg: ${designTokens.colors.background}
- --color-text: ${designTokens.colors.text}
Derive additional shades: --color-text-light, --color-dark, --color-primary-light (10% opacity tint), --color-accent-hover (slightly darker)

TYPOGRAPHY:
- Heading font: ${designTokens.fonts.heading} (import from Google Fonts)
- Body font: ${designTokens.fonts.body} (import from Google Fonts)
- Import both at weights: 400, 500, 600, 700

DESIGN STYLE: ${designTokens.style}
${designTokens.style === "dark" ? "Dark, dramatic aesthetic. Dark hero backgrounds, high contrast, neon-like accents. Moody and professional." : ""}
${designTokens.style === "warm" ? "Warm, earthy tones. Soft rounded corners (16px), warm shadows, inviting and approachable." : ""}
${designTokens.style === "bold" ? "Bold and commanding. Extra-large typography, strong contrast, impactful hero with big text." : ""}
${designTokens.style === "minimal" ? "Clean minimalism. Generous whitespace, thin lines, restrained colour, elegant typography." : ""}
${designTokens.style === "corporate" ? "Professional corporate. Structured grid, trust-focused, clean lines, sophisticated." : ""}
${designTokens.style === "rustic" ? "Natural and authentic. Earthy colours, organic shapes, textured backgrounds, craft feel." : ""}

LAYOUT PATTERNS TO FOLLOW: ${designTokens.layoutPatterns.join(", ")}

TESTIMONIALS TO USE${hasRealTestimonials ? " (real quotes from the tradie's website — use verbatim)" : ""}:
${testimonials!.map((t: { text: string; name: string; location?: string }, i: number) => `${i + 1}. "${t.text}" — ${t.name}${t.location ? `, ${t.location}` : ""}`).join("\n")}

CRITICAL REQUIREMENTS:
1. The HTML output must be 800-1200 lines minimum — a premium website needs SUBSTANCE
2. Every service needs its own card with a unique inline SVG icon and 2-sentence description
3. Write REAL, compelling copy — not filler text. Write as if you're the business owner
4. The hero must be full-viewport with a dramatic CSS gradient and subtle pattern overlay
5. Include a working mobile hamburger menu (JS-powered, not CSS-only)
6. Every section uses .reveal class for scroll-triggered fade-in animations
7. The nav changes on scroll (transparent → glass effect with backdrop-filter)
8. ALL phone numbers use tel: links, ALL emails use mailto: links
9. Footer MUST include: <a href="https://cheaptradiewebsites.co.nz">Website by CheapTradieWebsites.co.nz</a>
10. CSS-only visual placeholders — gradient boxes with subtle patterns for "image" areas
11. At least 10 unique inline SVG icons (services, trust badges, contact info, etc.)
12. The website must be fully responsive: mobile (375px), tablet (768px), desktop (1200px+)
${extractedContent ? "13. PRESERVE the tradie's actual content — their about text, services, and testimonials must appear faithfully in the new design." : ""}

OUTPUT: Return ONLY the complete HTML file starting with <!DOCTYPE html>. No markdown fences. No explanation. Just pure HTML.`;
}
