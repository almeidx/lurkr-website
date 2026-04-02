import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "collections/browser";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import type { ClientApiPageProps } from "fumadocs-openapi/ui/create-client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { ComponentProps } from "react";
import { Suspense } from "react";
import { APIPage } from "@/components/api-page.tsx";
import { getMDXComponents } from "@/components/mdx.tsx";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions.tsx";
import { openApiPageManifest } from "@/generated/openapi-page-manifest.ts";
import { cn } from "@/lib/cn.ts";
import { baseOptions } from "@/lib/layout.shared.tsx";
import { resolvePageUrl } from "@/lib/shared.ts";
import { GITHUB_REPOSITORY_URL } from "@/shared-links.ts";
import { DESCRIPTION } from "@/utils/constants.ts";
import { isValidDate } from "@/utils/is-valid-date.ts";

async function getOpenAPIPageData(pagePath: string) {
	const config = openApiPageManifest[pagePath];
	if (!config) {
		return null;
	}

	const { openapi } = await import("@/lib/openapi.ts");
	const processed = await openapi.getSchema(config.document);

	return {
		operations: config.operations as ClientApiPageProps["operations"],
		payload: {
			bundled: processed.bundled,
			proxyUrl: openapi.options.proxyUrl,
		},
	} satisfies ClientApiPageProps;
}

async function getPageData(slugs: string[]) {
	const { source } = await import("@/lib/source.ts");
	const page = source.getPage(slugs);
	if (!page) throw notFound();

	const apiPage = await getOpenAPIPageData(page.path);
	const lastModified = isValidDate(page.data.lastModified) ? page.data.lastModified.toISOString() : null;
	const publicUrl = resolvePageUrl(page.url);

	return {
		apiPage,
		description: page.data.description ?? DESCRIPTION,
		full: Boolean(page.data.full),
		githubUrl: `${GITHUB_REPOSITORY_URL}/blob/main/docs/content/${page.path}`,
		internalUrl: page.url,
		lastModified,
		markdownUrl: `${publicUrl}.mdx`,
		pageTree: await source.serializePageTree(source.getPageTree()),
		path: page.path,
		publicUrl,
		title: page.data.title,
	};
}

type DocsPageData = Awaited<ReturnType<typeof getPageData>>;
type HydratedDocsPageData = Omit<DocsPageData, "pageTree"> & {
	pageTree: Parameters<typeof DocsLayout>[0]["tree"];
};

const serverLoader = createServerFn({
	method: "GET",
})
	.inputValidator((slugs: string[]) => slugs)
	.handler(async ({ data: slugs }) => getPageData(slugs));

const clientLoader = browserCollections.docs.createClientLoader({
	component({ default: MDX, frontmatter, toc }, data: DocsPageData) {
		const lastUpdate = data.lastModified ? new Date(data.lastModified) : undefined;

		return (
			<DocsPage full={data.full} lastUpdate={isValidDate(lastUpdate) ? lastUpdate : undefined} toc={toc}>
				<DocsTitle>{frontmatter.title}</DocsTitle>
				<DocsDescription>{frontmatter.description}</DocsDescription>

				<div className={cn("flex flex-row items-center gap-2 border-b pb-6", frontmatter.description ? "-mt-8" : "")}>
					<LLMCopyButton markdownUrl={data.markdownUrl} />
					<ViewOptions githubUrl={data.githubUrl} markdownUrl={data.markdownUrl} />
				</div>

				<DocsBody>
					<MDX components={getMDXComponents({ a: createResolvedLink(data.internalUrl) })} />
				</DocsBody>
			</DocsPage>
		);
	},
});

export const Route = createFileRoute("/$")({
	component: Page,
	head: ({ loaderData }) => {
		const data: Pick<DocsPageData, "description" | "internalUrl" | "title"> = loaderData ?? {
			description: DESCRIPTION,
			internalUrl: "/",
			title: "Lurkr Docs",
		};

		const pageTitle = data.internalUrl === "/" ? "Lurkr Docs" : `${data.title} • Lurkr Docs`;

		return {
			meta: [
				{
					title: pageTitle,
				},
				{
					content: data.description,
					name: "description",
				},
				{
					content: data.title,
					property: "og:title",
				},
				{
					content: data.description,
					property: "og:description",
				},
			],
		};
	},
	headers: () => ({
		"Cache-Control": "public, max-age=0, s-maxage=10800",
	}),
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		if (!data.apiPage) {
			await clientLoader.preload(data.path);
		}
		return data;
	},
});

function Page() {
	const loaderData = Route.useLoaderData() as DocsPageData;
	const data = useFumadocsLoader(loaderData) as HydratedDocsPageData | undefined;
	if (!data) throw notFound();

	return (
		<DocsLayout {...baseOptions()} tree={data.pageTree}>
			{loaderData.apiPage ? (
				<OpenAPIPage apiPage={loaderData.apiPage} data={loaderData} />
			) : (
				<ContentPage data={data} loaderData={loaderData} />
			)}
		</DocsLayout>
	);
}

function ContentPage({ data, loaderData }: { data: HydratedDocsPageData; loaderData: DocsPageData }) {
	const content = clientLoader.useContent(data.path, loaderData);

	return <Suspense>{content}</Suspense>;
}

function OpenAPIPage({
	apiPage,
	data,
}: {
	apiPage: ClientApiPageProps;
	data: DocsPageData & {
		apiPage: ClientApiPageProps | null;
	};
}) {
	const lastUpdate = data.lastModified ? new Date(data.lastModified) : undefined;

	return (
		<DocsPage full={data.full} lastUpdate={isValidDate(lastUpdate) ? lastUpdate : undefined} toc={[]}>
			<DocsTitle>{data.title}</DocsTitle>
			<DocsDescription>{data.description}</DocsDescription>

			<div className={cn("flex flex-row items-center gap-2 border-b pb-6", data.description ? "-mt-8" : "")}>
				<LLMCopyButton markdownUrl={data.markdownUrl} />
				<ViewOptions githubUrl={data.githubUrl} markdownUrl={data.markdownUrl} />
			</div>

			<DocsBody>
				<APIPage {...apiPage} />
			</DocsBody>
		</DocsPage>
	);
}

function createResolvedLink(currentPath: string) {
	return function ResolvedLink({
		href,
		...props
	}: Omit<ComponentProps<"a">, "href"> & {
		href?: string;
	}) {
		if (!href || href.startsWith("#")) {
			return <defaultMdxComponents.a href={href} {...props} />;
		}

		const isExternal = /^\w+:/.test(href) || href.startsWith("//");
		if (isExternal) {
			return <defaultMdxComponents.a href={href} {...props} />;
		}

		const resolved = href.startsWith("/")
			? href
			: (() => {
					const url = new URL(href, `https://lurkr.gg${currentPath}`);
					return `${url.pathname}${url.search}${url.hash}`;
				})();

		return <defaultMdxComponents.a href={resolved} {...props} />;
	};
}
