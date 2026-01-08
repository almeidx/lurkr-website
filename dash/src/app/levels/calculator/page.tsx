import { MathOperations, SquareChartColumn, Stopwatch, Thunderbolt } from "@gravity-ui/icons";
import { Accordion } from "@heroui/react";
import type { Metadata } from "next";
import { Calculator } from "./calculator.tsx";

export default function CalculatorPage() {
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-4 py-12">
			<header className="flex flex-col items-center justify-center gap-4 text-center">
				<h1 className="bg-linear-to-br from-white to-white/50 bg-clip-text font-bold text-4xl text-transparent">
					Level Calculator
				</h1>

				<p className="max-w-lg text-center text-white/80 text-xl leading-relaxed tracking-tight">
					Calculate how much you need to chat instead of lurking in order to reach the level you want!
				</p>
			</header>

			<main className="flex w-full max-w-3xl flex-col items-center justify-center gap-4">
				<Calculator />
			</main>

			<div className="flex w-full max-w-3xl flex-col items-center gap-6">
				<h2 className="font-bold text-2xl md:text-3xl">Frequently Asked Questions</h2>

				<Accordion className="w-full">
					<Accordion.Item>
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<MathOperations className="text-zinc-400" />
									How is XP calculated?
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							XP is awarded per message based on a random value between your Min and Max XP settings (default 15 and 40,
							respectively). This calculation happens only once per interval (default 60 seconds) to ensure fair
							progression and prevent spam.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item>
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<Thunderbolt className="text-zinc-400" />
									What does the leveling multiplier do?
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							The Leveling Multiplier directly affects how fast users level up. A multiplier of 2.0x means users will
							level up twice as fast, requiring half the usual number of messages. A multiplier of 0.5x makes leveling
							twice as slow.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item>
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<Stopwatch className="text-zinc-400" />
									Why is there a cooldown?
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							The cooldown (XP Gain Interval) exists to prevent users from spamming short messages just to gain XP. It
							encourages meaningful conversation by limiting XP gain to a set interval, regardless of how many messages
							are sent within that time.
						</Accordion.Panel>
					</Accordion.Item>
					<Accordion.Item>
						<Accordion.Heading>
							<Accordion.Trigger>
								<div className="flex items-center gap-3">
									<SquareChartColumn className="text-zinc-400" />
									How is the required XP determined?
								</div>
								<Accordion.Indicator />
							</Accordion.Trigger>
						</Accordion.Heading>
						<Accordion.Panel className="text-muted">
							Required XP for each level increases quadratically. At this time, the formula used is "100 + 50 * (level -
							1)^2" and cannot be changed. This means higher levels require significantly more XP to reach than lower
							levels, creating a progressive difficulty curve.
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Calculate how much you need to chat instead of lurking in order to reach the level you want!",
	title: "Leveling Calculator",
};
