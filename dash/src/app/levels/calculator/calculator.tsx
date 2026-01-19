"use client";

import {
	ArrowDown,
	ArrowRight,
	ArrowUp,
	CircleQuestionFill,
	Flag,
	SquareChartColumn,
	Stopwatch,
	Thunderbolt,
} from "@gravity-ui/icons";
import { Surface } from "@heroui/react";
import { useState } from "react";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip.tsx";
import {
	MAX_XP_GAIN_INTERVAL,
	MAX_XP_MULTIPLIER_VALUE,
	MAX_XP_PER_MESSAGE,
	MIN_XP_GAIN_INTERVAL,
	MIN_XP_MULTIPLIER_VALUE,
	MIN_XP_PER_MESSAGE,
} from "@/lib/guild-config.ts";
import { formatNumber } from "@/utils/format-number.ts";
import { prettySeconds } from "@/utils/pretty-seconds.ts";
import { CalculatorInput } from "./calculator-input.tsx";
import { CalculatorResult } from "./calculator-result.tsx";
import {
	APPROXIMATE_MESSAGES_TOOLTIP,
	ESTIMATED_TIME_TOOLTIP,
	EXPERIENCE_REQUIRED_TOOLTIP,
	LEVELING_MULTIPLIER_TOOLTIP,
	XP_GAIN_INTERVAL_TOOLTIP,
	XP_RANGE_TOOLTIP,
} from "./tooltips.ts";

const MAX_LEVEL = 6_554;

export function Calculator() {
	const [desiredLevel, setDesiredLevel] = useState("");
	const [currentLevel, setCurrentLevel] = useState("0");
	const [multiplier, setMultiplier] = useState("1");
	const [xpGainInterval, setXpGainInterval] = useState("60");
	const [xpPerMessageMin, setXpPerMessageMin] = useState("15");
	const [xpPerMessageMax, setXpPerMessageMax] = useState("40");

	const { approxMessages, estimatedTime, expRequired } = calculate(
		desiredLevel,
		currentLevel,
		multiplier,
		xpGainInterval,
		xpPerMessageMin,
		xpPerMessageMax,
	);

	const formattedEstimatedTime = prettySeconds(estimatedTime);

	return (
		<div className="flex w-full flex-col gap-8">
			<div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
				<div className="flex min-w-0 flex-1 flex-col gap-4">
					<Surface className="rounded-3xl p-6 sm:p-8">
						<div className="flex flex-col gap-6 sm:flex-row">
							<CalculatorInput
								className="min-w-0 flex-1"
								id="currentLevel"
								label="Current Level"
								max={MAX_LEVEL}
								min={0}
								onValueChange={setCurrentLevel}
								placeholder="e.g. 5"
								startContent={<SquareChartColumn />}
								value={currentLevel}
							/>

							<ArrowRight className="mt-6 hidden text-zinc-400 md:flex" />

							<CalculatorInput
								autoFocus
								className="min-w-0 flex-1"
								id="desiredLevel"
								label="Desired Level"
								max={MAX_LEVEL}
								min={1}
								onValueChange={setDesiredLevel}
								placeholder="e.g. 100"
								startContent={<Flag />}
								value={desiredLevel}
							/>
						</div>
					</Surface>

					<Surface className="grid grid-cols-1 gap-6 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
						<CalculatorInput
							id="xpGainInterval"
							label="Cooldown (sec)"
							max={MAX_XP_GAIN_INTERVAL / 1000}
							min={MIN_XP_GAIN_INTERVAL / 1000}
							onValueChange={setXpGainInterval}
							placeholder="e.g. 60"
							startContent={<Stopwatch />}
							tooltip={XP_GAIN_INTERVAL_TOOLTIP}
							value={xpGainInterval}
						/>

						<CalculatorInput
							id="multiplier"
							label="Multiplier (x)"
							max={MAX_XP_MULTIPLIER_VALUE}
							min={MIN_XP_MULTIPLIER_VALUE}
							onValueChange={setMultiplier}
							placeholder="e.g. 1"
							startContent={<Thunderbolt />}
							step={MIN_XP_MULTIPLIER_VALUE}
							tooltip={LEVELING_MULTIPLIER_TOOLTIP}
							value={multiplier}
						/>

						<CalculatorInput
							id="xpPerMessageMin"
							label="Min XP per msg."
							max={MAX_XP_PER_MESSAGE}
							min={MIN_XP_PER_MESSAGE}
							onValueChange={setXpPerMessageMin}
							placeholder="e.g. 15"
							startContent={<ArrowDown />}
							tooltip={XP_RANGE_TOOLTIP}
							value={xpPerMessageMin}
						/>

						<CalculatorInput
							id="xpPerMessageMax"
							label="Max XP per msg."
							max={MAX_XP_PER_MESSAGE}
							min={MIN_XP_PER_MESSAGE}
							onValueChange={setXpPerMessageMax}
							placeholder="e.g. 40"
							startContent={<ArrowUp />}
							tooltip={XP_RANGE_TOOLTIP}
							value={xpPerMessageMax}
						/>
					</Surface>
				</div>

				<div className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-8 lg:w-96">
					<Surface className="rounded-3xl border border-white/5 bg-linear-to-br from-primary/10 to-transparent p-8 backdrop-blur-md">
						<div className="mb-2 flex items-center gap-2 text-small text-zinc-400 uppercase tracking-wider">
							Approximate Messages
							<ResponsiveTooltip
								content={<div className="max-w-xs text-center">{APPROXIMATE_MESSAGES_TOOLTIP}</div>}
								delay={100}
							>
								<div className="cursor-help transition-colors hover:text-white">
									<CircleQuestionFill className="size-4 fill-current" />
								</div>
							</ResponsiveTooltip>
						</div>
						<div
							className="bg-linear-to-br from-white to-white/60 bg-clip-text font-bold text-6xl text-transparent tracking-tighter"
							title={approxMessages.toString()}
						>
							{formatNumber(approxMessages)}
						</div>
					</Surface>

					<div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
						<CalculatorResult
							label="Time"
							title={formattedEstimatedTime}
							tooltip={ESTIMATED_TIME_TOOLTIP}
							value={formattedEstimatedTime}
						/>

						<CalculatorResult
							label="XP Needed"
							title={expRequired.toString()}
							tooltip={EXPERIENCE_REQUIRED_TOOLTIP}
							value={formatNumber(expRequired)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function calculate(
	desiredLevel: string,
	currentLevel: string,
	multiplier: string,
	xpGainInterval: string,
	xpPerMessageMin: string,
	xpPerMessageMax: string,
) {
	const desiredLevel_ = Number.parseInt(desiredLevel, 10);
	const currentLevel_ = Number.parseInt(currentLevel, 10) || 0;
	const multiplier_ = Number.parseFloat(multiplier) || 1;
	const xpGainInterval_ = Number.parseInt(xpGainInterval, 10) || 60;
	const xpPerMessageMin_ = Number.parseInt(xpPerMessageMin, 10) || 15;
	const xpPerMessageMax_ = Number.parseInt(xpPerMessageMax, 10) || 40;

	function isBetween(value: number, min: number, max: number) {
		return value >= min && value <= max;
	}

	if (
		Number.isNaN(desiredLevel_) ||
		!isBetween(desiredLevel_, 1, MAX_LEVEL) ||
		!isBetween(currentLevel_, 0, MAX_LEVEL) ||
		!isBetween(multiplier_, MIN_XP_MULTIPLIER_VALUE, MAX_XP_MULTIPLIER_VALUE) ||
		!isBetween(xpGainInterval_, MIN_XP_GAIN_INTERVAL / 1000, MAX_XP_GAIN_INTERVAL / 1000) ||
		!isBetween(xpPerMessageMin_, MIN_XP_PER_MESSAGE, MAX_XP_PER_MESSAGE) ||
		!isBetween(xpPerMessageMax_, MIN_XP_PER_MESSAGE, MAX_XP_PER_MESSAGE) ||
		xpPerMessageMin_ > xpPerMessageMax_
	) {
		return { approxMessages: 0, estimatedTime: 0, expRequired: 0 };
	}

	const expRequired = getRequiredXp(desiredLevel_) - getRequiredXp(currentLevel_);
	const avgXpPerMessage = (xpPerMessageMin_ + xpPerMessageMax_) / 2;

	const approxMessages = Math.ceil(expRequired / avgXpPerMessage / multiplier_);
	const estimatedTime = approxMessages * xpGainInterval_;

	return { approxMessages, estimatedTime, expRequired };
}

function getRequiredXp(level: number): number {
	return level === 0 ? 0 : 100 + 50 * (level - 1) ** 2;
}
