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
- Lucide React for icons
- Geist font family (sans + mono)

### Project Structure

All source lives under `src/app/` using Next.js App Router conventions:
- `src/app/page.tsx` — Homepage (composes section components)
- `src/app/customize/page.tsx` — Product customizer with 3D viewer
- `src/app/cart/page.tsx` — Shopping cart (guest checkout flow)
- `src/app/track/page.tsx` — Order tracking
- `src/app/about/`, `src/app/privacy-policy/`, `src/app/terms/` — Static pages
- `src/app/components/` — Shared UI components (Header, Footer, Hero, FAQ, etc.)
- `src/app/data/` — Static data files (products, reviews)
- `src/app/assets/` — Static images

### Key Patterns

- **Client components**: Most interactive components use `"use client"` directive since they rely on Framer Motion, Three.js, or browser APIs.
- **No backend/auth**: Currently uses localStorage for cart state and dummy data. No database or auth provider yet.
- **3D viewer**: `ProductViewer3D` uses React Three Fiber with `@react-three/drei` helpers. Wrapped in a client component.
- **Animations**: Use `motion` package (Framer Motion v12+). Import from `"motion/react"` not `"framer-motion"`.

### Styling

Tailwind v4 with `@theme inline` block in `src/app/globals.css`:
- Custom colors available as utilities: `bg-cream`, `bg-warm`, `text-foreground`, `text-accent-dark`
- Design uses a warm, minimal aesthetic with uppercase tracking for labels

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Things to remember
- Dont Commit and Push until it is said to do.