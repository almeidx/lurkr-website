"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import type { ComponentProps } from "react";

export function ThemedImage({ lightSrc, darkSrc, ...props }: ThemedImageProps) {
	const { resolvedTheme } = useTheme();
	let src: ComponentProps<typeof Image>["src"];

	switch (resolvedTheme) {
		case "light":
			src = lightSrc;
			break;
		default:
			src = darkSrc;
			break;
	}

	return <Image suppressHydrationWarning {...props} src={src} priority />;
}

interface ThemedImageProps extends Omit<ComponentProps<typeof Image>, "src"> {
	lightSrc: ComponentProps<typeof Image>["src"];
	darkSrc: ComponentProps<typeof Image>["src"];
}
