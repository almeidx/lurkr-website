"use client";

import Image, { type StaticImageData } from "next/image";
import { type ComponentProps, useRef, useState } from "react";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";

/**
 * A wrapper around Next.js' Image component that allows for a fallback image to be used if the original image fails to load.
 *
 * @remarks
 * Uses `fallback` if `src` is nullable.
 */
export function ImageWithFallback({ src, fallback = fallbackAvatarImg, ...props }: ImageWithFallbackProps) {
	const [hasError, setHasError] = useState(false);
	const currentSrc = hasError ? fallback : (src ?? fallback);

	const prevSrcRef = useRef(src);
	if (prevSrcRef.current !== src) {
		prevSrcRef.current = src;
		setHasError(false);
	}

	return <Image {...props} onError={() => setHasError(true)} src={currentSrc} />;
}

type NextImageProps = ComponentProps<typeof Image>;

interface ImageWithFallbackProps extends Omit<NextImageProps, "src"> {
	readonly fallback?: StaticImageData;
	readonly src: NextImageProps["src"] | null;
}
