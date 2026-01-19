# Architecture

## Repository Structure

```
lurkr-website/
├── dash/                    # Web dashboard (@lurkr/dashboard)
│   ├── src/
│   └── public/
├── docs/                    # Documentation site (@lurkr/docs)
│   ├── content/             # MDX documentation
│   ├── src/
│   └── scripts/
├── shared/                  # Shared utilities (NOT a package)
│   ├── common.ts
│   └── shared-links.ts
└── biome.json
```

## Shared Utilities

The `shared/` directory is **not a package**. Import via relative paths:

```typescript
import { BASE_URL } from "../../shared/shared-links.ts";
```

Key exports in `shared/shared-links.ts`:
- `BASE_URL`: https://lurkr.gg
- `SUPPORT_SERVER_INVITE`: Discord support server
- `GITHUB_REPOSITORY_URL`: This repository
- `BOT_INVITE`: Discord bot invite link

## Domain Configuration

Both sites are hosted at `lurkr.gg`:
- Dashboard at root (`/`)
- Docs at `/docs`

The dashboard rewrites `/docs` requests to the docs site (configured in `dash/next.config.ts`).

## Dashboard Routes

Guild configuration pages follow the pattern:
```
dash/src/app/guilds/[guildId]/<feature>/page.tsx
```

Features: leveling, roles, multipliers, milestones, emojis, etc.
