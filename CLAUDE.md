# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build
- `npm run lint` — Run ESLint (flat config, `eslint.config.mjs`)

No test framework is configured.

## Architecture

This is a **Next.js 16** app (App Router) for **threadly.one**, a custom embroidery e-commerce site. Deployed to Netlify via `@netlify/plugin-nextjs`.

### Stack
- React 19, TypeScript, Tailwind CSS v4 (PostCSS plugin)
- Framer Motion (`motion` package) for animations
- React Three Fiber + Drei for 3D product viewer
- Geist font family (sans + mono)

### Project Structure

All source lives under `src/app/` using Next.js App Router conventions:
- `src/app/page.tsx` — Homepage (composes section components)
- `src/app/customize/page.tsx` — Product customizer with 3D viewer
- `src/app/about/`, `src/app/profile/`, `src/app/privacy-policy/`, `src/app/terms/` — Static pages
- `src/app/components/` — Shared UI components (Header, Footer, Hero, FAQ, etc.)
- `src/app/data/` — Static data files (products, reviews)
- `src/app/assets/` — Static images

### Styling

Tailwind v4 with custom theme tokens defined in `src/app/globals.css`:
- `--cream` / `--warm` — Background palette
- `--foreground` / `--accent-dark` — Text/dark tones
- Design uses a warm, minimal aesthetic with uppercase tracking for labels

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
