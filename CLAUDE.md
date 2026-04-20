# Project Dominator: Master Instructions

## Tech Stack
- **Backend:** Payload CMS 3.0 (Next.js based)
- **Database:** Neon.tech (PostgreSQL / Serverless)
- **Frontend:** Astro 5.0+
- **Styling:** Tailwind CSS 4.0
- **Deployment:** Railway (CMS), Vercel (Web)

## Project Structure
- `/cms`: Payload CMS (The Source of Truth)
- `/web`: Astro Frontend (The UI)

## Critical Workflow Rules
1. **Type Safety:** Always reference `/cms/src/payload-types.ts` when building Astro components. Strictly avoid `any` types.
2. **Connectivity:** Use `PUBLIC_CMS_URL` for frontend fetches. Ensure server-side calls utilize the internal network when possible.
3. **Absolute Imports:** Use aliases (e.g., `@components/Hero.astro`) as defined in `tsconfig.json`.

## Architecture Philosophy
- **Dynamic Content:** If a client might change it (text, images, colors), it MUST be a Payload field. No hardcoded strings in components.
- **Prop-Driven UI:** Components should be "dumb"—they receive data via props and render it using Tailwind 4.0.
- **Performance:** Default to **Zero-JS**. Use Astro `client:load` or `client:visible` only when interactivity is strictly required.
- **Documentation:** Write for a Junior Developer. Use JSDoc to explain the "Why" behind functions.

## Commands
- **Dev Backend:** `cd cms && npm run dev`
- **Dev Frontend:** `cd web && npm run dev`
- **Sync Types:** `cd cms && npm run generate:types`