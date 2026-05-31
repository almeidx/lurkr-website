"use client";

import Image, { type StaticImageData } from "next/image";
import { type ComponentProps, useState } from "react";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";

/**
 * A wrapper around Next.js' Image component that allows for a fallback image to be used if the original image fails to load.
 *
 * @remarks
 * Uses `fallback` if `src` is nullable.
 */
export function ImageWithFallback({ src, fallback = fallbackAvatarImg, ...props }: ImageWithFallbackProps) {
	const [failedSrc, setFailedSrc] = useState<NextImageProps["src"] | null>(null);
	const shouldUseFallback = !src || failedSrc === src;
	const currentSrc = shouldUseFallback ? fallback : src!;

	return <Image {...props} onError={() => !shouldUseFallback && src && setFailedSrc(src)} src={currentSrc} />;
}

type NextImageProps = ComponentProps<typeof Image>;

interface ImageWithFallbackProps extends Omit<NextImageProps, "src"> {
	readonly fallback?: StaticImageData;
	readonly src: NextImageProps["src"] | null;
}
