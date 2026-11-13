// Post-processes the static build for deployment under lurkr.gg/docs.
//
// Waku's `basePath` prefixes every URL in the build with `/docs`, but it emits
// the static files at the root of `dist/public` rather than under `docs/`. The
// docs worker is served behind a proxy that only forwards `/docs/*`, so this
// script moves the whole site into `dist/public/docs/`, keeping the Cloudflare
// `_headers`/`_redirects` control files at the assets root.
import { mkdir, readdir, rename } from "node:fs/promises";
import path from "node:path";

const scriptDir = import.meta.dirname;
const publicDir = path.resolve(scriptDir, "../dist/public");
const docsDir = path.join(publicDir, "docs");

// Control files Cloudflare reads from the root of the assets directory.
const KEEP_AT_ROOT = new Set(["_headers", "_redirects", "docs"]);

await mkdir(docsDir, { recursive: true });
for (const entry of await readdir(publicDir)) {
	if (KEEP_AT_ROOT.has(entry)) continue;
	await rename(path.join(publicDir, entry), path.join(docsDir, entry));
}

console.log("[postbuild] nested site under /docs");
