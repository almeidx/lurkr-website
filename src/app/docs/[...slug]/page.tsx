import { CustomMDX } from "@/components/CustomMDX.tsx";
import { BASE_URL } from "@/utils/constants.ts";
import { getDocumentationPages } from "@/utils/mdx.tsx";
import { Time } from "@/utils/time.ts";
import { MdArrowBackIos } from "@react-icons/all-files/md/MdArrowBackIos";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params: { slug } }: { readonly params: { readonly slug: string[] } }) {
	// SAFETY
	if (slug.some((part) => part.startsWith("_") || part.includes("."))) {
		notFound();
	}

	const normalizedSlug = slug.join("/");

	const posts = getDocumentationPages();
	const post = posts.find((post) => post.slug === normalizedSlug);

	if (!post) {
		notFound();
	}

	return (
		<>
			<div className="flex flex-col-reverse lg:justify-between lg:items-center lg:flex-row mt-2">
				<div>
					<h1 className="font-bold text-4xl mt-6 mb-3">{post.metadata.title}</h1>
					<p>{post.metadata.summary}</p>
				</div>

				<Link href="/docs" className="flex items-center gap-1 mt-4 mb-0">
					<MdArrowBackIos />
					Go back
				</Link>
			</div>

			<CustomMDX source={post.content} />

			<p className="text-white/75 text-sm mt-6">Last updated {formatDateToDaysAgo(post.metadata.publishedAt)}</p>
		</>
	);
}

export async function generateStaticParams() {
	const pages = getDocumentationPages();

	return pages.map((page) => ({
		slug: page.slug.split("/"),
	}));
}

export function generateMetadata({ params }: { readonly params: { readonly slug: string[] } }) {
	const post = getDocumentationPages().find((page) => page.slug === params.slug.join("/"));
	if (!post) {
		return;
	}

	const { title, publishedAt: publishedTime, summary: description } = post.metadata;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			publishedTime,
			url: `${BASE_URL}/docs/${post.slug}`,
		},
	};
}

function formatDateToDaysAgo(date: Date) {
	const now = new Date();

	if (now.toDateString() === date.toDateString()) {
		return "today";
	}

	const diffTime = date.getTime() - now.getTime();
	const diffDays = Math.floor(diffTime / Time.Days);

	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
	return rtf.format(diffDays, "day");
}
