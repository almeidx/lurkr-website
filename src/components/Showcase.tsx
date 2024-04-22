import clsx from "clsx";
import Image, { type StaticImageData } from "next/image";
import type { PropsWithChildren } from "react";

export function Showcase({
							 title,
							 imgSrc,
							 description,
							 index,
						 }: PropsWithChildren<{
	title: string;
	imgSrc: StaticImageData;
	description: string;
	index: number;
}>) {
	return (
		<div className={clsx("", index % 2 === 0 ? "bg-[#99999911]" : "")}>
			<div
				className={clsx(
					"flex justify-center flex-col py-16 xl:py-32 items-center max-w-[1280px] mx-auto gap-10 xl:gap-24",
					index % 2 === 0 ? "xl:flex-row" : "xl:flex-row-reverse",
				)}
			>
				<Image className="max-w-[600px] w-full px-8 xl:px-0" alt={title} src={imgSrc} height={300} width={600} />
				<div className="flex flex-col text-center xl:text-left xl:w-1/3 px-4 xl:px-0">
					<h2 className="text-xl xl:text-4xl font-bold tracking-wide mb-2 xl:mb-6">{title}</h2>
					<p className="text-white/75 xl:text-xl max-w-md">{description}</p>
				</div>
			</div>
		</div>
	);
}
