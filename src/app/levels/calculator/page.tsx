import type { Metadata } from "next";
import Calculator from "./calculator";

export default function CalculatorPage() {
	return (
		<div className="min-h-screen-no-footer bg-discord-dark flex flex-col items-center">
			<header className="mx-3 my-4 flex flex-col items-center gap-4 text-center sm:mx-0 sm:mb-6">
				<h1 className="text-2xl font-bold text-white sm:text-4xl">Level Calculator</h1>
				<p className="font-light text-gray-400">Calculate how much you need to message to reach a certain level!</p>
			</header>

			<main className="flex max-w-sm flex-col gap-4 sm:max-w-2xl">
				<Calculator />
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Level Calculator | Lurkr",
};
