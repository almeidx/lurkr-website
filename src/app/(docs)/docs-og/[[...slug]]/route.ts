import { generateOGImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));
	if (!page) notFound();

	return generateOGImage({
		description: page.data.description,
		site: "Lurkr Docs",
		title: page.data.title,
	});
}

export function generateStaticParams() {
	return source.generateParams().map((page) => ({
		...page,
		slug: [...page.slug, "image.png"],
	}));
}
