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
			<Image className="aspect-[2/1]" alt={title} src={imgSrc} height={300} width={600} />

			<div className="flex flex-col gap-2 xl:grid xl:grid-rows-3">
				<div className="hidden xl:block" />

				<div className="text-center gap-4 row-span-2 flex flex-col xl:grid xl:grid-cols-4">
					<div className="hidden xl:flex xl:justify-end">
						<div className="size-fit p-3 rounded-xl bg-darker">{children}</div>
					</div>

					<div className="col-span-3 flex flex-col xl:gap-4">
						<p className="xl:place-self-start text-xl xl:text-3xl font-bold text-shadow-regular mt-3">{title}</p>
						<p className="xl:text-left text-white/75 xl:text-xl tracking-tighter max-w-md">{description}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
