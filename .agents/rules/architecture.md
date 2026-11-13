# Architecture

- `dash/` owns the dashboard at the site root.
- `docs/` owns the Fumadocs Press documentation site mounted at `/docs`. It is
  built as a static Waku/Vite export.
- `shared/` contains source shared by both applications. It is not a package;
  import it with the existing relative-path pattern rather than adding a
  package dependency or a second copy.

The docs deployment serves its static export under `/docs`. Waku's `basePath`
prefixes every exported URL, and `docs/scripts/postbuild.mjs` moves the files
into `dist/public/docs/` to match that mount point.

Guild settings routes follow
`dash/src/app/guilds/[guildId]/<feature>/page.tsx`. Keep feature-specific code
near its route and move code into `shared/` only when both applications truly
consume it.
