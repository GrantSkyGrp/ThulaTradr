# Thula Platform Rewrite Blueprint

## Direction

This rewrite keeps the current Laravel application as the workflow reference while rebuilding the product in Next.js with:

- generic asset terminology
- brand-driven presentation
- future white-label support
- UI layout patterns kept recognisable relative to the current app

## What stays the same conceptually

- public marketing and discovery experience
- buyer and seller lifecycle
- admin and operations workflow
- listings and offers
- invoice and transaction process
- document transfer stages
- CMS-like content areas

## What changes technically

- Blade to React / Next.js App Router
- PHP services to typed application modules
- hard-coded aviation naming to generic asset language
- single-brand UI to configurable brand packages

## White-label rules

- no hard-coded brand name inside workflow modules
- no hard-coded asset class names inside core domain logic
- navigation, contact content, colors, and hero copy come from brand config
- Thula is the active brand package, not a fork of the app

## Early build phases

1. Build the white-label shell and public pages
2. Build generic asset and listing models
3. Recreate listing and offer UI flows
4. Recreate auth, permissions, and admin surfaces
5. Recreate documents, notifications, and back-office operations
