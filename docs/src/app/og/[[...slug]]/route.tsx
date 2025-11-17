import { generate as DefaultImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { getPageImage, source } from "@/lib/source.ts";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/og/[[...slug]]">) {
	const { slug } = await params;

	const lastSegment = slug?.at(-1);
	if (lastSegment !== "image.png") {
		return NextResponse.json({ error: "Not Found" }, { status: 404 });
	}

	const page = source.getPage(slug?.slice(0, -1) ?? []);
	if (!page) notFound();

	return new ImageResponse(
		<DefaultImage description={page.data.description} site="Lurkr Documentation" title={page.data.title} />,
		{
			height: 630,
			width: 1200,
		},
	);
}

export function generateStaticParams() {
	return source.getPages().map((page) => ({
		lang: page.locale,
		slug: getPageImage(page).segments,
	}));
}
