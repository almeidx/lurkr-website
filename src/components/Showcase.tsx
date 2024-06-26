import clsx from "clsx";
import Image, { type StaticImageData } from "next/image";
import type { PropsWithChildren } from "react";

export function Showcase({
	children,
	title,
	imgSrc,
	description,
	index,
}: PropsWithChildren<{ title: string; imgSrc: StaticImageData; description: string; index: number }>) {
	return (
		<div className={clsx("flex flex-col gap-2 xl:gap-8", index % 2 === 0 ? "xl:flex-row" : "xl:flex-row-reverse")}>
			<Image className="aspect-[2/1]" alt={title} src={imgSrc} height={300} width={600} priority={index < 2} />

			<div className="flex flex-col gap-2 xl:grid xl:grid-rows-3">
				<div className="hidden xl:block" />

				<div className="row-span-2 flex flex-col gap-4 text-center xl:grid xl:grid-cols-4">
					<div className="hidden xl:flex xl:justify-end">
						<div className="size-fit rounded-xl bg-darker p-3">{children}</div>
					</div>

					<div className="col-span-3 flex flex-col xl:gap-4">
						<p className="mt-3 font-bold text-shadow-regular text-xl xl:place-self-start xl:text-3xl">{title}</p>
						<p className="max-w-md text-white/75 tracking-tighter xl:text-left xl:text-xl">{description}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
