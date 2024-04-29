import { DocumentationPageList } from "@/app/docs/page-list.tsx";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { DOCS_URL } from "@/utils/constants.ts";

export default function DocsPage() {
	return (
		<div className="max-w-7xl mx-auto mt-8">
			<h1 className="text-3xl font-bold mb-2">Documentation</h1>
			<p className="text-white/75 mb-3">
				Here are all the pages that are currently available in the updated docs. If what you're looking for isn't here,
				please go to the{" "}
				<ExternalLink className="text-blurple" href={DOCS_URL}>
					old docs
				</ExternalLink>
				.
			</p>

			<DocumentationPageList />
		</div>
	);
}
