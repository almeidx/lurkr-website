# Code standards

For code changes, run the checks that cover the affected application. The root
CI-equivalent checks are:

```sh
pnpm lint
pnpm build:typecheck
```

Use `pnpm fmt` when formatting fixes are intended, then review the resulting
diff because it writes changes across the workspace. CI also builds both
applications; build the affected app locally when routing, server behavior, or
production bundling changes.
