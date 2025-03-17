"use client";

import showcaseDarkImg from "@/assets/showcase-dark.png";
import showcaseLightImg from "@/assets/showcase-light.png";
import { ThemedImage } from "@/components/themed-image.tsx";

export default function HeroImage() {
	return (
		<section aria-label="Hero Image of the website" className="flow-root">
			<div className="rounded-2xl bg-slate-50/40 p-2 ring-1 ring-slate-200/50 ring-inset dark:bg-gray-900/70 dark:ring-white/10">
				<div className="rounded-xl bg-white ring-1 ring-slate-900/5 dark:bg-slate-950 dark:ring-white/15">
					<ThemedImage
						lightSrc={showcaseLightImg}
						darkSrc={showcaseDarkImg}
						alt="A preview of the Database web app"
						width={2400}
						height={1600}
						className="rounded-xl shadow-2xl dark:shadow-indigo-600/10"
					/>
				</div>
			</div>
		</section>
	);
}
