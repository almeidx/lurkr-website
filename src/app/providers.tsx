"use client";

import { BRAND_COLOR } from "@/utils/constants.ts";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { type PropsWithChildren, Suspense } from "react";

// TODO: https://github.com/Skyleen77/next-nprogress-bar/issues/17

export function Providers({ children }: PropsWithChildren) {
	return (
		<>
			{children}

			{/* TODO: Investigate if Suspense is necessary */}
			{/* biome-ignore lint/complexity/noUselessFragments: The auto fix causes a syntax error */}
			<Suspense fallback={<></>}>
				<ProgressBar height="2px" color={BRAND_COLOR} options={{ showSpinner: false }} shallowRouting />
			</Suspense>
		</>
	);
}
