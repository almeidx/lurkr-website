import Image from "next/image";
import type { ComponentProps } from "react";

export function RoundedImage(props: ComponentProps<typeof Image>) {
	return (
		<div className="flex justify-center items-center flex-col w-full gap-2">
			<Image className="rounded-lg" {...props} />
			<p className="text-white/75 text-sm">{props.alt}</p>
		</div>
	);
}
