import type { BusinessInfo, ExtractedDesignTokens } from "./types";

export function getSystemPrompt(): string {
  return `You are a web designer specialising in trade and construction business websites for New Zealand tradies. Generate a complete, self-contained HTML file with inline CSS and minimal inline JavaScript.

REQUIREMENTS:
- Single HTML file, fully self-contained (no external dependencies except Google Fonts)
- Mobile-first responsive design
- Sections: Navigation, Hero, Services, About Us, Testimonials, Contact/Quote Form, Footer
- Use the provided colour palette and typography style
- NZ English spelling throughout (colour, specialise, organisation, etc.)
- Include placeholder testimonials relevant to the trade type
- Contact form with: Name, Phone, Email, Message, Submit button
- SEO: proper meta tags, Open Graph, LocalBusiness structured data
- Hero should feature a strong call to action: "Get a Free Quote"
- Business phone number prominently in header and footer
- Professional, trustworthy aesthetic appropriate for the trade
- All content should reference the specific location and region in New Zealand
- Smooth scroll navigation
- Scroll-reveal animations (CSS only, using @keyframes + IntersectionObserver)
- NO references to AI, Claude, Anthropic, or any AI-related branding anywhere

OUTPUT: Return ONLY the complete HTML. No markdown, no explanation, no code fences.`;
}

export function getUserPrompt(
  businessInfo: BusinessInfo,
  designTokens: ExtractedDesignTokens
): string {
  return `Generate a professional website for this New Zealand trade business:

BUSINESS DETAILS:
- Business Name: ${businessInfo.businessName}
- Trade Type: ${businessInfo.tradeType}
- Location: ${businessInfo.location}, ${businessInfo.region}
- Phone: ${businessInfo.phone}
- Email: ${businessInfo.email}
- Services: ${businessInfo.services.join(", ")}
- About: ${businessInfo.aboutText}
${businessInfo.tagline ? `- Tagline: ${businessInfo.tagline}` : ""}
${businessInfo.yearsExperience ? `- Years Experience: ${businessInfo.yearsExperience}` : ""}

DESIGN STYLE:
- Primary colour: ${designTokens.colors.primary}
- Secondary colour: ${designTokens.colors.secondary}
- Accent colour: ${designTokens.colors.accent}
- Background colour: ${designTokens.colors.background}
- Text colour: ${designTokens.colors.text}
- Heading font: ${designTokens.fonts.heading}
- Body font: ${designTokens.fonts.body}
- Overall style: ${designTokens.style}
- Layout patterns: ${designTokens.layoutPatterns.join(", ")}

Generate a complete, production-quality HTML file that looks like it was designed by a professional web designer, not a template. Make it feel authentic to the ${businessInfo.tradeType} trade in ${businessInfo.region}, New Zealand.`;
}
