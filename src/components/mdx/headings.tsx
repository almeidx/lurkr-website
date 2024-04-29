import assert from "node:assert";
import slugify from "@sindresorhus/slugify";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function createHeading(level: number) {
	assert(level !== 1, "h1 is reserved for the page title");

	const Heading = ({ children }: PropsWithChildren) => {
		const slug = slugify(children!.toString());
		const Tag = `h${level}` as keyof JSX.IntrinsicElements;

		return (
			<a href={`#${slug}`}>
				<Tag
					id={slug}
					className={clsx(
						"font-bold",
						{
							2: "text-3xl mt-6 mb-3",
							3: "text-2xl mt-4 mb-2",
							4: "text-xl mt-3 mb-2",
							5: "text-lg mt-2 mb-1",
							6: "text-base my-1",
						}[level],
					)}
				>
					{children}
				</Tag>
			</a>
		);
	};

	Heading.displayName = `Heading${level}`;

	return Heading;
}
