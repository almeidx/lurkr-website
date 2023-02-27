import { Calculator } from "./calculator";

export default function LevelCalculator() {
	return (
		<div className="flex min-h-screen-no-footer flex-col items-center bg-discord-dark">
			<header className="my-4 mx-3 flex flex-col items-center gap-4 text-center sm:mx-0 sm:mb-6">
				<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">Level Calculator</h1>
				<p className="font-light text-gray-400">Calculate how much you need to message to reach a certain level!</p>
			</header>

			<main className="flex max-w-sm flex-col gap-4 sm:max-w-2xl">
				<Calculator />
			</main>
		</div>
	);
}

export const metadata = {
	title: "Level Calculator | Pepe Manager",
};
