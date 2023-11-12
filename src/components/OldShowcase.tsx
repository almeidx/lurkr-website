import clsx from "clsx";
import Image, { type StaticImageData } from "next/image";
import type { ComponentProps, PropsWithChildren } from "react";

export function Showcase({ description, children, imgSrc, index, isLast, title }: ShowcaseProps) {
	const isFirst = index === 0;
	const isEven = index % 2 === 0;
	const imgOptions = (isFirst ? { priority: true } : {}) satisfies Partial<ComponentProps<typeof Image>>;

	return (
		<section className="grid max-h-80 grid-cols-[1fr_10rem_1fr]">
			<Image
				alt={title}
				className={clsx("aspect-[2/1]", !isEven && "order-last")}
				height={300}
				src={imgSrc}
				width={600}
				{...imgOptions}
			/>

			<div className="relative flex items-center justify-center before:absolute before:left-[calc(50%-0.25rem/2)] before:top-0 before:h-full before:w-1 before:bg-white/75 after:absolute after:left-[calc(50%-1.25rem/2)] after:top-[calc(50%-1.25rem/2)] after:h-5 after:w-5 after:rounded-full after:border-4 after:border-white/75 after:bg-background">
				{isFirst ? (
					<>
						<div className="absolute left-[calc(50%-2.25rem/2)] top-0 z-20 h-9 w-9 rounded-full bg-ellipse-radial" />
						<div className="absolute left-[calc(50%-2.25rem/2)] top-0 z-10 h-9 w-9 rounded-full bg-ellipse-radial blur-md" />

						<div className="absolute left-[calc(50%-0.25rem/2)] top-9 z-10 flex h-[6.5rem] w-1 translate-x-[calc(50%-0.125rem)] bg-dashed-squares bg-size-10" />
					</>
				) : null}

				{isLast ? (
					<>
						<div className="absolute left-[calc(50%-0.25rem/2)] top-[calc(50%+1.25rem/2)] z-10 flex h-[6.5rem] w-1 bg-dashed-squares bg-size-10" />
						<div className="absolute left-[calc(50%-0.25rem/2)] top-[calc(50%+1.25rem/2+6.5rem)] z-20 flex h-10 w-1 bg-background" />
					</>
				) : null}
			</div>

			<div className={clsx("grid grid-rows-3", !isEven && "order-first place-items-end")}>
				<div />

				<div className="h-full">
					<div className={clsx("flex h-full items-center gap-8", !isEven && "flex-row-reverse")}>
						<div className="h-fit w-fit rounded-xl bg-darker p-3">{children}</div>

						<p className="text-center text-3xl font-bold">{title}</p>
					</div>
				</div>

				<p
					className={clsx(
						"flex h-full max-w-md text-xl tracking-tighter text-white/75",
						isEven ? "ml-24" : "items-top mr-24 text-end",
					)}
				>
					{description}
				</p>
			</div>
		</section>
	);
}

type ShowcaseProps = PropsWithChildren<{
	readonly description: string;
	readonly imgSrc: StaticImageData;
	readonly index: number;
	readonly isLast?: boolean;
	readonly title: string;
}>;
