// Post-processes the static build for deployment under lurkr.gg/docs.
//
// Waku's `basePath` correctly prefixes assets, links, navigation and the search
// API with `/docs`, but it (a) emits the static files at the root of
// `dist/public` rather than under `docs/`, and (b) does not prefix a few
// absolute URLs that Fumapress plugins build from `page.url` (og:image, sitemap
// <loc>, and the markdown "copy" URL). The docs worker is served behind a proxy
// that only forwards `/docs/*`, so everything must live under that path.
//
// This script: 1) moves the whole site into `dist/public/docs/` (keeping the
// Cloudflare `_headers`/`_redirects` control files at the assets root), and
// 2) repairs the handful of absolute URLs that lost the `/docs` prefix.
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(scriptDir, "../dist/public");
const docsDir = path.join(publicDir, "docs");

// Control files Cloudflare reads from the root of the assets directory.
const KEEP_AT_ROOT = new Set(["_headers", "_redirects", "docs"]);

await mkdir(docsDir, { recursive: true });
for (const entry of await readdir(publicDir)) {
	if (KEEP_AT_ROOT.has(entry)) continue;
	await rename(path.join(publicDir, entry), path.join(docsDir, entry));
}

const REWRITABLE_EXTENSIONS = new Set([".html", ".xml", ".txt", ".json"]);

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(full);
		else yield full;
	}
}

let patched = 0;
for await (const file of walk(docsDir)) {
	if (!REWRITABLE_EXTENSIONS.has(path.extname(file))) continue;

	const original = await readFile(file, "utf8");
	let updated = original
		// og:image / social card images: https://lurkr.gg/<page>.webp -> /docs/<page>.webp
		.replaceAll(/https:\/\/lurkr\.gg\/(?!docs(?:[/?#"]|\\|$))((?:[^"'\\ )]+)\.webp)/g, "https://lurkr.gg/docs/$1")
		// sitemap <loc> entries built from the (base-path-less) page url
		.replaceAll(/<loc>https:\/\/lurkr\.gg\/(?!docs(?:[/?#<]|$))/g, "<loc>https://lurkr.gg/docs/")
		// "Copy markdown" / view-as-markdown URLs (RSC payload, escaped and raw)
		.replaceAll(/markdownUrl\\":\\"\/(?!docs(?:[/?#"]|\\|$))/g, 'markdownUrl\\":\\"/docs/')
		.replaceAll(/markdownUrl":"\/(?!docs(?:[/?#"]|\\|$))/g, 'markdownUrl":"/docs/');

	// The llms.txt index and full-text export link to pages with root-relative
	// urls (`](/guides/...)`) that also need the base path.
	const basename = path.basename(file);
	if (basename === "llms.txt" || basename === "llms-full.txt") {
		updated = updated.replaceAll(/\]\(\/(?!docs(?:[/?#)]|$))/g, "](/docs/");
	}

	if (updated !== original) {
		await writeFile(file, updated);
		patched++;
	}
}

console.log(`[postbuild] nested site under /docs, repaired base path in ${patched} files`);
