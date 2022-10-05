import { useCallback, useEffect, useRef } from "react";

export interface ShowcaseProps {
	align: "left" | "right";
	description: string;
	src: string;
	title: string;
}

export default function Showcase({ align, description, src, title }: ShowcaseProps) {
	const videoRef = useRef<HTMLVideoElement>(null);

	// https://stackoverflow.com/a/63887052/11252146
	const makeVideoPlayable = useCallback((): void => {
		if (!videoRef.current) {
			return;
		}

		const x = videoRef.current.offsetLeft;
		const y = videoRef.current.offsetTop;
		const width = videoRef.current.offsetWidth;
		const height = videoRef.current.offsetHeight;
		const right = x + width; // right
		const bottom = y + height; // bottom

		const visibleX = Math.max(0, Math.min(width, window.scrollX + window.innerWidth - x, right - window.scrollX));
		const visibleY = Math.max(0, Math.min(height, window.scrollY + window.innerHeight - y, bottom - window.scrollY));

		const visible = (visibleX * visibleY) / (width * height);

		if (visible > 0.8) {
			void videoRef.current.play();
		} else {
			videoRef.current.pause();
		}
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", makeVideoPlayable, false);
		window.addEventListener("resize", makeVideoPlayable, false);

		return () => {
			window.removeEventListener("scroll", makeVideoPlayable);
			window.removeEventListener("resize", makeVideoPlayable);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section className="flex flex-col items-center gap-6 lg:grid lg:grid-cols-3 lg:px-6 xl:px-48">
			<video
				autoPlay
				className="w-[93%] rounded-md sm:w-3/4 lg:h-auto lg:w-full"
				controls={false}
				loop
				muted
				playsInline
				preload="none"
				ref={videoRef}
				src={src}
			/>

			<div
				className={`${
					align === "left" ? "row-start-1" : ""
				} col-span-2 mx-3 flex h-full flex-col justify-center px-2 text-center sm:px-16 lg:px-0 lg:text-left`}
			>
				<h2 className="font-display text-lg font-bold text-white sm:text-xl">{title}</h2>
				<p className="mt-3 font-light text-gray-400">{description}</p>
			</div>
		</section>
	);
}
