import Image, { type StaticImageData } from "next/image";

export default function Showcase({ align, description, index, src, title }: ShowcaseProps) {
	// Only prioritize the first image
	const imgProps = index > 0 ? { placeholder: "blur" as const } : { priority: true };

	return (
		<section className="flex flex-col items-center gap-6 lg:grid lg:grid-cols-3 lg:px-6 xl:px-48">
			<Image alt={title} className="rounded-md" height={204} src={src} width={364} {...imgProps} />

			<div
				className={`${
					align === "left" ? "row-start-1" : ""
				} col-span-2 mx-3 flex h-full flex-col justify-center px-2 text-center sm:px-16 lg:px-0 lg:text-left`}
			>
				<h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
				<p className="mt-3 font-light text-gray-400">{description}</p>
			</div>
		</section>
	);
}

export interface ShowcaseProps {
	align: "left" | "right";
	description: string;
	index: number;
	src: StaticImageData;
	title: string;
}
