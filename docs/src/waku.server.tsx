// Custom Waku server entry, used only to force a pure static export.
//
// Fumapress's built-in (managed) server entry always calls the Waku adapter
// without `static: true`. On Cloudflare Workers Builds (`WORKERS_CI` is set),
// Waku resolves the default adapter to `waku/adapters/cloudflare` and would
// build a *Worker* — which crashes on cold start, because importing
// `press.config.tsx` runs the OpenAPI spec read (`node:fs`) on the
// filesystem-less Workers runtime. Pinning the adapter here with
// `static: true` makes the build a no-Worker static export instead (the docs
// are fully prerendered via `mode: "static"`), so nothing runs at request time.
//
// We don't use Waku's file-based routing (`src/pages`) — every route comes from
// the content sources and plugins in `press.config.tsx`, which the router
// creates internally — so `createPages()` is called with no argument.
import { createRouter } from "fumapress/router";
import adapter from "waku/adapters/cloudflare";
import pressConfig from "../press.config";

// Fumapress's managed entry passes this config through a virtual module. Its
// public generic is invariant when the same call lives in a type-checked source
// file, so keep the assertion at this custom boundary.
const router = await createRouter(pressConfig as Parameters<typeof createRouter>[0]);
const pages = router.createPages();
const middlewareFns = router.createMiddlewares();
const patchedAdapter = router.patchAdapter(adapter);

export default patchedAdapter(pages, { middlewareFns, static: true });
