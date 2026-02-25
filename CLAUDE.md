# CheapTradieWebsites

AI-powered website builder for NZ tradies. Pick a style, answer a few questions, get a live website.

## Commands
- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint

## Rules
- Stage specific files only — NEVER `git add -A` after initial commit
- Never replace page.tsx or layout.tsx wholesale without reading first
- Never reformat existing code
- All user-facing text should use NZ English spelling

## Tech Stack
- Next.js 14 (App Router), React 19, TypeScript
- Tailwind CSS 4
- Anthropic Claude API for website generation
- Vercel for hosting

## File Structure
```
src/
  app/              # Next.js pages and API routes
    builder/        # Multi-step website builder flow
    api/            # API routes (generate, preview, checkout)
    blog/           # Blog pages
    privacy/        # Privacy policy
    terms/          # Terms of service
  components/
    layout/         # Header, Footer
    landing/        # Landing page sections
    builder/        # Builder flow components
    ui/             # Shared UI components (Button, Card, etc.)
  lib/              # Utilities, API clients, types
public/             # Static assets
docs/plans/         # Implementation plans
```
