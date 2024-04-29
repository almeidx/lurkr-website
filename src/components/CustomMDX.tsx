import { Separator } from "@/components/Separator.tsx";
import { CustomLink } from "@/components/mdx/anchor.tsx";
import { createHeading } from "@/components/mdx/headings.tsx";
import { RoundedImage } from "@/components/mdx/image.tsx";
import { Paragraph } from "@/components/mdx/paragraph.tsx";
import { UnorderedList } from "@/components/mdx/ul.tsx";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";

const components: MDXComponents = {
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	a: CustomLink,
	ul: UnorderedList,
	p: Paragraph,
	Image: RoundedImage,
	Separator,
};

export function CustomMDX(props: ComponentProps<typeof MDXRemote>) {
	return <MDXRemote {...props} components={{ ...components, ...(props.components ?? {}) }} />;
}
