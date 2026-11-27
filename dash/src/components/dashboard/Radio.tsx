import { Radio as HeroRadio } from "@heroui/react";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function Radio({ children, controlPosition = "start", value }: RadioProps) {
	return (
		<HeroRadio className="group mt-0" value={value}>
			<HeroRadio.Content
				className={clsx(
					"text-lg font-normal tracking-tight text-white/75 md:text-xl",
					controlPosition === "end" ? "w-full flex-row-reverse justify-between gap-4" : "gap-2",
				)}
			>
				<HeroRadio.Control className="size-6 rounded-full border-0 bg-primary shadow-none">
					<HeroRadio.Indicator>
						<span className="size-full rounded-full bg-white transition-transform duration-150 ease-in-out group-data-selected:scale-[calc(1/3)]" />
					</HeroRadio.Indicator>
				</HeroRadio.Control>

				{children}
			</HeroRadio.Content>
		</HeroRadio>
	);
}

export { RadioGroup } from "@heroui/react";

interface RadioProps extends PropsWithChildren {
	/** Side of the label the radio button is on. */
	readonly controlPosition?: "end" | "start";
	readonly value: string;
}
