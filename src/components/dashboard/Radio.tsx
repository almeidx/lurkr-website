import { Radio as AriakitRadio } from "@ariakit/react/radio";
import type { ComponentProps } from "react";

export function Radio(props: Omit<ComponentProps<typeof AriakitRadio>, "className">) {
	return (
		<AriakitRadio
			className="ml-4 grid h-6 w-6 appearance-none place-content-center rounded-full bg-white before:h-[10px] before:w-[10px] before:scale-100 before:rounded-full before:duration-150 before:ease-in-out checked:border-[0.5rem] checked:border-primary checked:before:scale-100 checked:before:shadow-[inset_1em_1em_white]"
			{...props}
		/>
	);
}

export { RadioGroup, useRadioStore } from "@ariakit/react";
