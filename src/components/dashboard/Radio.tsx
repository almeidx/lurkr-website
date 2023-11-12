"use client";

import { Radio as AriakitRadio } from "@ariakit/react/radio";
import clsx from "clsx";
import type { ComponentProps } from "react";

export function Radio({
	rightMargin = false,
	...props
}: Omit<ComponentProps<typeof AriakitRadio>, "className"> & { rightMargin?: boolean }) {
	return (
		<AriakitRadio
			className={clsx(
				"grid size-6 appearance-none place-content-center rounded-full bg-white before:size-[10px] before:scale-100 checked:before:scale-100 before:rounded-full checked:border-8 checked:border-primary checked:before:shadow-[inset_1em_1em_white] before:duration-150 before:ease-in-out",
				rightMargin ? "mr-2" : "ml-4",
			)}
			{...props}
		/>
	);
}

export { RadioGroup, useRadioStore } from "@ariakit/react/radio";
