import { redirect } from "@tanstack/react-router";
import { createMiddleware, createStart } from "@tanstack/react-start";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { docsContentRoute, docsRoute } from "@/lib/shared.ts";
import { getNextConfigHeaders } from "../../shared/common.ts";

const { rewrite: rewriteDocs } = rewritePath(`${docsRoute}{/*path}`, `${docsContentRoute}{/*path}`);

const { rewrite: rewriteSuffix } = rewritePath(`${docsRoute}{/*path}.mdx`, `${docsContentRoute}{/*path}`);

const permanentRedirects = new Map<string, string>([
	[`${docsRoute}/config-commands`, `${docsRoute}/config-commands/config`],
	[`${docsRoute}/utility-commands/emoji/create-emoji`, `${docsRoute}/utility-commands/emoji/create`],
	[`${docsRoute}/utility-commands/emoji/delete-emoji`, `${docsRoute}/utility-commands/emoji/delete`],
	[`${docsRoute}/utility-commands/emoji/download-emoji`, `${docsRoute}/utility-commands/emoji/download`],
	[`${docsRoute}/utility-commands/emoji/random-emoji`, `${docsRoute}/utility-commands/emoji/random`],
	[`${docsRoute}/utility-commands/emoji/search-emoji`, `${docsRoute}/utility-commands/emoji/search`],
]);

const securityHeaders = getNextConfigHeaders()[0]?.headers ?? [];

const requestMiddleware = createMiddleware().server(({ next, request }) => {
	const url = new URL(request.url);
	const normalizedPathname =
		url.pathname !== docsRoute && url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;

	const redirectTarget = permanentRedirects.get(normalizedPathname);
	if (redirectTarget) {
		throw redirect({
			href: `${redirectTarget}${url.search}${url.hash}`,
			statusCode: 301,
		});
	}

	const llmPath = rewriteSuffix(url.pathname);
	if (llmPath) {
		throw redirect(new URL(llmPath, url));
	}

	const skipMarkdownNegotiation =
		url.pathname.startsWith(`${docsRoute}/api/`) ||
		url.pathname === `${docsRoute}/sitemap.xml` ||
		url.pathname.startsWith(`${docsRoute}/llms`) ||
		/\.[a-z0-9]+$/i.test(url.pathname);

	if (!skipMarkdownNegotiation && isMarkdownPreferred(request)) {
		const markdownPath = rewriteDocs(url.pathname);
		if (markdownPath) {
			throw redirect(new URL(markdownPath, url));
		}
	}

	return next();
});

const responseHeadersMiddleware = createMiddleware().server(async ({ next }) => {
	const result = await next();

	for (const header of securityHeaders) {
		result.response.headers.set(header.key, header.value);
	}

	return result;
});

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [requestMiddleware, responseHeadersMiddleware],
	};
});
