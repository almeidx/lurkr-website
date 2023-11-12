"use client";

import { BRAND_COLOR } from "@/utils/constants.ts";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { type PropsWithChildren, Suspense } from "react";

export function Providers({ children }: PropsWithChildren) {
	return (
		<>
			{children}

			{/* biome-ignore lint/complexity/noUselessFragments: The auto fix causes a syntax error */}
			<Suspense fallback={<></>}>
				<ProgressBar height="2px" color={BRAND_COLOR} options={{ showSpinner: false }} shallowRouting />
			</Suspense>
		</>
	);
}
