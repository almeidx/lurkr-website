"use client";

import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import Image, { type StaticImageData } from "next/image";
import { type ComponentProps, useEffect, useState } from "react";

/**
 * A wrapper around Next.js' Image component that allows for a fallback image to be used if the original image fails to load.
 *
 * @remarks
 * Uses `fallback` if `src` is nullable.
 */
export function ImageWithFallback({ src, fallback = fallbackAvatarImg, ...props }: ImageWithFallbackProps) {
	const [image, setImage] = useState(src ?? fallback);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intended
	useEffect(() => {
		setImage(src ?? fallback);
	}, [src]);

	return <Image {...props} onError={() => setImage(fallback)} src={image} />;
}

type NextImageProps = ComponentProps<typeof Image>;

interface ImageWithFallbackProps extends Omit<NextImageProps, "src"> {
	readonly fallback?: StaticImageData;
	readonly src: NextImageProps["src"] | null;
}
