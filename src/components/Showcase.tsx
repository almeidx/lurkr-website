import Image, { type StaticImageData } from "next/image";
import type { ComponentProps } from "react";

export default function Showcase({ description, index, src, title }: ShowcaseProps) {
	// Only prioritize the first image
	const imgProps = (index > 0 ? { placeholder: "blur" as const } : { priority: true }) satisfies Partial<
		ComponentProps<typeof Image>
	>;

	return (
		<section className="flex flex-col items-center gap-6 lg:grid lg:grid-cols-3 lg:px-6 xl:px-48">
			<Image alt={title} className="rounded-md" height={193} src={src} width={386} {...imgProps} />

			<div
				className={`${
					index % 2 === 1 ? "row-start-1 " : ""
				}col-span-2 mx-3 flex h-full flex-col justify-center px-2 text-center sm:px-16 lg:px-0 lg:text-left`}
			>
				<h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
				<p className="mt-3 font-light text-gray-400">{description}</p>
			</div>
		</section>
	);
}

export interface ShowcaseProps {
	readonly description: string;
	readonly index: number;
	readonly src: StaticImageData;
	readonly title: string;
}
