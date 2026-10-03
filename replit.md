# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Bíblia em Cordel

Brazilian cordel-style Bible reader, available as both:
- **Mobile** (`artifacts/mobile`) — Expo / React Native app, native preview via expo-domain.
- **Web** (`artifacts/web`) — thin wrapper that runs `expo export -p web` against the mobile source and serves the resulting static SPA. **No source duplication** — the web artifact has no `src/`; it builds from `artifacts/mobile`.

Mobile's `app/_layout.tsx` includes a `WebFrame` that activates only when `Platform.OS === "web"`, centering the mobile-first layout in a 480px-wide column with a soft shadow on desktop. `mobile/app.json` sets `experiments.baseUrl = "/web"` so web bundles reference assets at `/web/...` (the platform's path-routed prefix). Native builds ignore `baseUrl`.

Web artifact scripts (`artifacts/web/scripts/`):
- `build.js` — runs `expo export --platform web` from mobile dir into `dist/public`.
- `dev.js` — one-shot build then `serve.js` (no HMR; restart the workflow to rebuild).
- `serve.js` — tiny Node static server with SPA fallback and BASE_PATH stripping.

artifact.toml uses `serve = "static"` for production; the build step runs `web/build.js` and the platform serves `dist/public` directly.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
