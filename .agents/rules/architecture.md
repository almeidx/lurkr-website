# Architecture

- `dash/` owns the dashboard at the site root.
- `docs/` owns the documentation site mounted at `/docs`.
- `shared/` contains source shared by both applications. It is not a package;
  import it with the existing relative-path pattern rather than adding a
  package dependency or a second copy.

The dashboard forwards `/docs` requests to the docs deployment through
`dash/next.config.mts`. Changes to that mount point must be checked in both
applications, including asset and internal-link paths.

Guild settings routes follow
`dash/src/app/guilds/[guildId]/<feature>/page.tsx`. Keep feature-specific code
near its route and move code into `shared/` only when both applications truly
consume it.
