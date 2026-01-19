# Development Setup

## Dependencies

```bash
pnpm install --frozen-lockfile
```

## Environment Variables

Both `dash/` and `docs/` have `.env.local.example` files. Copy to `.env.local` and configure.

Development/production env files (`.env.development`, `.env.production`) are pre-configured.

**Note**: Sign-in features require a local API instance (not publicly available).

## Dev Servers

```bash
cd dash && pnpm run dev   # Dashboard
cd docs && pnpm run dev   # Docs site
```
