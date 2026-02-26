# CheapTradieWebsites

## Commands
- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint

## Rules
- Never replace page.tsx or layout.tsx wholesale without reading first
- All user-facing text should use NZ English spelling

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- Anthropic Claude API for website generation
- Zod for validation

## Environment
Copy `.env.example` to `.env.local` and fill in:
- `ANTHROPIC_API_KEY` — required for AI generation
- `VERCEL_TOKEN` — required for deployment
- `FRONTEND_DESIGN_SKILL_ID` — Agent Skills API (optional locally)

## File Structure
```
src/
  app/              # Next.js pages and API routes
    (marketing)/    # Marketing route group (Header/Footer layout)
      blog/         # Blog page
      privacy/      # Privacy policy
      terms/        # Terms of service
    builder/        # Multi-step website builder flow
    api/            # API routes (analyze, extract, generate, preview, checkout, deploy)
  components/
    layout/         # Header, Footer
    landing/        # Landing page sections
    builder/        # Builder flow components
    ui/             # Shared UI components
  lib/              # Utilities, API clients, types
public/             # Static assets
docs/               # Implementation plans and architecture docs
skills/             # Claude Agent Skills definitions
```
