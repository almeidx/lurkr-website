import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { getPageImage, resolvePageUrl, source } from "@/lib/source.ts";
import { getMDXComponents } from "@/mdx-components.tsx";
import { GITHUB_REPOSITORY_URL } from "@/shared-links";
import { isValidDate } from "@/utils/is-valid-date.ts";

export const dynamicParams = false;

export default async function Page(props: PageProps<"/[[...slug]]">) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	const pageUrl = resolvePageUrl(page.url);

	return (
		<DocsPage
			full={page.data.full}
			lastUpdate={isValidDate(page.data.lastModified) ? new Date(page.data.lastModified) : undefined}
			toc={page.data.toc}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>

			<div className="-mt-8 flex flex-row items-center gap-2 border-b pb-6">
				<LLMCopyButton markdownUrl={`${pageUrl}.mdx`} />
				<ViewOptions
					githubUrl={`${GITHUB_REPOSITORY_URL}/blob/main/docs/content/${page.path}`}
					markdownUrl={`${pageUrl}.mdx`}
				/>
			</div>

			<DocsBody>
				<MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/[[...slug]]">): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		description: page.data.description,
		openGraph: {
			images: getPageImage(page).url,
		},
		title: page.data.title,
	} satisfies Metadata;
}
