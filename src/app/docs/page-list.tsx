import { getDocumentationPages } from "@/utils/mdx.tsx";
import Link from "next/link";

export function DocumentationPageList() {
	const pages = getDocumentationPages();

	return (
		<ul className="list-disc">
			{pages.map((page) => (
				<li key={page.slug} className="ml-5 mb-3">
					<Link className="text-lg" href={`/docs/${page.slug}`}>
						{page.metadata.title}
					</Link>
					<p className="text-white/75">{page.metadata.summary}</p>
					<p className="text-white/75 text-sm">Last updated at {page.metadata.publishedAt.toLocaleDateString("sv")}</p>
				</li>
			))}
		</ul>
	);
}
