"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { type PropsWithChildren, Suspense } from "react";
import { Toaster } from "sonner";
import { BRAND_COLOR } from "@/utils/constants.ts";

export function Providers({ children }: PropsWithChildren) {
	return (
		<>
			{children}

			<Suspense>
				<ProgressBar color={BRAND_COLOR} height="2px" options={{ showSpinner: false }} shallowRouting />
				<Toaster closeButton richColors />
			</Suspense>
		</>
	);
}
