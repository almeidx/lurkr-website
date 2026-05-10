# Development Setup

## Prerequisites

- Node.js >= 24.15 (see `.node-version`)
- pnpm 11 (enable via `corepack enable`)

## Dependencies

```bash
pnpm install --frozen-lockfile
```

## Environment Variables

Both `dash/` and `docs/` have `.env.local.example` files. Copy to `.env.local` and configure.

**Note**: Sign-in features require a local API instance (not publicly available).

## Dev Servers

```bash
cd dash && pnpm run dev   # Dashboard
cd docs && pnpm run dev   # Docs site
```
