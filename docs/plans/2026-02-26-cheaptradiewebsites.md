# CheapTradieWebsites Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a web application where NZ tradies can get a custom AI-generated website by picking a template or pasting a URL they like, answering a few business questions, and getting a live site — free to preview, $500 to keep.

**Architecture:** Next.js 14 app on Vercel with a marketing landing page and a multi-step website builder flow. Claude API generates complete static websites from templates + business info. Generated sites are deployed to Vercel via API. Payment via LemonSqueezy (placeholder for now).

**Tech Stack:** Next.js 14 (App Router), React 19, Tailwind CSS 4, TypeScript, Anthropic Claude API, Vercel SDK/API, LemonSqueezy (placeholder)

---

## Design Tokens (from Wix Construction Templates reference)

```
Colors:
  --bg-primary: #FFFFFF
  --bg-secondary: #F5F3EF (warm off-white)
  --bg-dark: #1A1A1A
  --text-primary: #1A1A1A
  --text-secondary: #5A5A5A
  --text-on-dark: #FFFFFF
  --accent: #E8740C (construction orange)
  --accent-hover: #D06400
  --accent-secondary: #2D5A27 (tradie green)
  --border: #E5E5E5

Typography:
  --font-heading: 'Inter', sans-serif (bold, large)
  --font-body: 'Inter', sans-serif
  --heading-xl: clamp(2.5rem, 5vw, 4rem)
  --heading-lg: clamp(2rem, 4vw, 3rem)
  --heading-md: clamp(1.5rem, 3vw, 2rem)
  --body: 1rem / 1.6

Spacing:
  --section-padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 4rem)
  --card-padding: 1.5rem
  --gap: 1.5rem

Components:
  --radius-sm: 0.375rem
  --radius-md: 0.75rem
  --radius-lg: 1rem
  --shadow-card: 0 2px 8px rgba(0,0,0,0.08)
  --shadow-hover: 0 8px 24px rgba(0,0,0,0.12)
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `.gitignore`, `.env.example`, `CLAUDE.md`

**Step 1: Initialize Next.js project**

```bash
cd /c/Users/Other/Desktop/cheaptradiewebsites
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

**Step 2: Create CLAUDE.md**

Project rules file with:
- Project name and description
- Build/dev commands
- File structure map
- Rules: stage specific files, never `git add -A` after initial commit

**Step 3: Create .env.example**

```
ANTHROPIC_API_KEY=your_key_here
VERCEL_TOKEN=your_token_here
LEMONSQUEEZY_API_KEY=your_key_here
```

**Step 4: Verify dev server starts**

```bash
npm run dev
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: initial Next.js project scaffold"
```

---

## Task 2: Marketing Landing Page — Layout & Navigation

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/ui/Button.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Build shared UI components**

- Button component (primary orange, secondary outline, sizes)
- Header with logo text, nav links, CTA button, mobile hamburger
- Footer with links, copyright

**Step 2: Set up design tokens in globals.css**

CSS custom properties matching the design tokens above, plus Tailwind theme extension.

**Step 3: Update layout.tsx**

Add Header + Footer wrapping, Inter font, metadata.

**Step 4: Verify**

```bash
npm run dev
```
Check header/footer render, mobile menu works.

**Step 5: Commit**

```bash
git add src/components/ src/app/layout.tsx src/app/globals.css
git commit -m "feat: add layout components — header, footer, button"
```

---

## Task 3: Marketing Landing Page — Hero Section

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Build Hero component**

Full-viewport hero with:
- Bold headline: "Get a Professional Website for Your Trade Business"
- Subheading: "No tech skills needed. Pick a style, answer a few questions, get a live website. From $500."
- Large URL input field: "Paste a website you like the look of..."
- OR "Browse Templates" button below
- Background: construction-themed gradient or pattern
- Social proof: "Built for NZ tradies — builders, sparkies, plumbers & more"

**Step 2: Wire up to page.tsx**

**Step 3: Verify responsive layout (mobile/desktop)**

**Step 4: Commit**

---

## Task 4: Marketing Landing Page — Features, How It Works, Pricing

**Files:**
- Create: `src/components/landing/HowItWorks.tsx`
- Create: `src/components/landing/Features.tsx`
- Create: `src/components/landing/Pricing.tsx`
- Create: `src/components/landing/FAQ.tsx`
- Create: `src/components/landing/TemplateGallery.tsx`
- Modify: `src/app/page.tsx`

**Step 1: How It Works section**

3-step visual:
1. "Pick a style" — Choose a template or paste a website you like
2. "Tell us about your business" — Answer a few quick questions
3. "Get your website" — Preview it free, pay $500 to keep it

**Step 2: Features section**

- AI-powered custom design
- Mobile-friendly
- Built for NZ tradies
- Live in minutes
- Free preview
- Hosted for you

**Step 3: Template Gallery**

Grid of 6-8 construction/trade template cards (placeholder images initially).

**Step 4: Pricing section**

Single card: $500 one-time, free preview, what's included list.

**Step 5: FAQ section**

5 questions: How long does it take? Do I need tech skills? What if I already have a website? Can I make changes? What's included in the $500?

**Step 6: Verify all sections render and scroll smoothly**

**Step 7: Commit**

---

## Task 5: Website Builder Flow — Step 1 (Choose Style)

**Files:**
- Create: `src/app/builder/page.tsx`
- Create: `src/app/builder/layout.tsx`
- Create: `src/components/builder/StepIndicator.tsx`
- Create: `src/components/builder/TemplateSelector.tsx`
- Create: `src/components/builder/UrlInput.tsx`
- Create: `src/lib/types.ts`

**Step 1: Define types**

```typescript
interface BuilderState {
  step: 1 | 2 | 3 | 4
  styleChoice: 'template' | 'url' | null
  templateId?: string
  referenceUrl?: string
  businessInfo: BusinessInfo
  generatedSiteId?: string
}

interface BusinessInfo {
  businessName: string
  tradeType: string
  location: string
  phone: string
  email: string
  services: string[]
  aboutText: string
  existingWebsite?: string
}
```

**Step 2: Build step indicator** (Step 1 of 4 progress bar)

**Step 3: Build template selector** — Grid of template cards with preview images

**Step 4: Build URL input** — Paste a URL with preview/validation

**Step 5: Builder page with two paths** — "Pick a Template" or "I Like This Website"

**Step 6: Verify flow**

**Step 7: Commit**

---

## Task 6: Website Builder Flow — Step 2 (Business Info)

**Files:**
- Create: `src/components/builder/BusinessInfoForm.tsx`
- Create: `src/components/builder/ExistingWebsiteImport.tsx`

**Step 1: Build business info form**

Simple, friendly form:
- Business name
- What trade? (dropdown: Builder, Electrician, Plumber, Drainlayer, Painter, Roofer, Landscaper, Concrete, Other)
- Location (city/region in NZ)
- Phone number
- Email
- Services offered (multi-select or free text)
- Short description / about text
- "Already have a website? Paste the URL and we'll grab your info"

**Step 2: Build existing website import**

If they paste a URL, show a loading state and extract business info (server action that scrapes basic info).

**Step 3: Verify form validation and flow**

**Step 4: Commit**

---

## Task 7: Claude API Integration — Website Generation

**Files:**
- Create: `src/app/api/generate/route.ts`
- Create: `src/lib/claude.ts`
- Create: `src/lib/prompts.ts`
- Create: `src/lib/templates.ts`

**Step 1: Create Claude API client wrapper**

Using @anthropic-ai/sdk, create a function that:
- Takes business info + style choice (template or reference URL)
- Builds a detailed prompt for Claude to generate a complete static website
- Returns generated HTML/CSS/JS

**Step 2: Create prompt templates**

Detailed system prompt for generating tradie websites:
- Must be mobile-responsive
- Must include: header with logo/name, hero with trade description, services section, about section, contact info, footer
- NZ-specific (phone format, locations, language)
- Professional construction/trade aesthetic
- Complete self-contained HTML with inline CSS

**Step 3: Create template definitions**

6-8 trade-specific templates with style descriptions and example layouts.

**Step 4: Build the API route**

POST `/api/generate` — accepts BuilderState, calls Claude, returns generated site HTML.

**Step 5: Verify with test request**

**Step 6: Commit**

---

## Task 8: Website Builder Flow — Step 3 (Preview)

**Files:**
- Create: `src/components/builder/SitePreview.tsx`
- Create: `src/app/api/preview/route.ts`

**Step 1: Build preview component**

- Full-width iframe showing the generated website
- Desktop/tablet/mobile preview toggle
- "Love it? Get this website for $500" CTA
- "Want changes? Tell us what to tweak" feedback input
- Loading state with progress messages while Claude generates

**Step 2: Build preview API route**

Serves the generated HTML in an iframe-friendly way.

**Step 3: Verify preview renders correctly**

**Step 4: Commit**

---

## Task 9: Website Builder Flow — Step 4 (Payment & Delivery)

**Files:**
- Create: `src/components/builder/PaymentStep.tsx`
- Create: `src/app/api/checkout/route.ts`

**Step 1: Build payment step component**

- Summary of what they're getting
- $500 NZD one-time payment
- LemonSqueezy checkout button (placeholder for now)
- "Not ready? Your preview link is valid for 7 days"

**Step 2: Build checkout API route (placeholder)**

For now, a placeholder that would redirect to LemonSqueezy checkout.

**Step 3: Verify flow end-to-end**

**Step 4: Commit**

---

## Task 10: SEO, Legal & Blog Pages

**Files:**
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `public/site.webmanifest`

**Step 1: Privacy policy page** (NZ-appropriate)

**Step 2: Terms of service page**

**Step 3: Blog listing page** (empty grid, ready for posts)

**Step 4: Sitemap and robots.txt**

**Step 5: Manifest file**

**Step 6: Commit**

---

## Task 11: Vercel Deployment Config

**Files:**
- Create: `vercel.json`
- Modify: `next.config.ts` (security headers)

**Step 1: Create vercel.json** with security headers and caching rules

**Step 2: Update next.config.ts** with headers config

**Step 3: Commit**

---

## Task 12: Go Live

**Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/launchey/cheaptradiewebsites.git
git push -u origin main
```

**Step 2: Connect to Vercel**

Guide user through Vercel import.

**Step 3: Verify live deployment**

**Step 4: Celebrate**

---

## Execution Notes

- Tasks 1-4 are the marketing site (can be built and deployed first)
- Tasks 5-9 are the builder flow (core product)
- Tasks 10-11 are polish
- Task 12 is deployment
- The Claude API integration (Task 7) requires an ANTHROPIC_API_KEY env var
- Generated sites will need a deployment strategy (Vercel API or static hosting)
