import type { Metadata } from "next";
import { Calculator } from "./calculator.tsx";

export default function CalculatorPage() {
	return (
		<div className="flex flex-col items-center justify-center gap-12 py-4">
			<header className="flex flex-col items-center justify-center gap-4">
				<h1 className="font-bold text-4xl text-white">Level Calculator</h1>

				<p className="max-w-md px-2 text-center text-white/75 text-xl leading-relaxed tracking-tighter">
					Calculate how much you need to chat instead of lurking in order to reach the level you want!
				</p>
			</header>

			<main className="flex max-w-3xl flex-col items-center justify-center gap-8">
				<Calculator />
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Calculate how much you need to chat instead of lurking in order to reach the level you want!",
	title: "Leveling Calculator",
};
