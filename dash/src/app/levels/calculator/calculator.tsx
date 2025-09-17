"use client";

import { useState } from "react";
import { InfoSection } from "@/app/levels/calculator/info-section.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
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
import { APPROXIMATE_MESSAGES_TOOLTIP, ESTIMATED_TIME_TOOLTIP, EXPERIENCE_REQUIRED_TOOLTIP } from "./tooltips.ts";

const MAX_LEVEL = 6_554;

export function Calculator() {
	const [desiredLevel, setDesiredLevel] = useState("");
	const [currentLevel, setCurrentLevel] = useState("");
	const [multiplier, setMultiplier] = useState("");
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

	return (
		<>
			<div className="flex flex-col gap-y-5">
				<div className="flex flex-col items-center gap-5 md:flex-row">
					<div className="flex flex-col items-start gap-2">
						<label className="font-medium text-sm text-white/75" htmlFor="desiredLevel">
							Desired Level
						</label>
						<Input
							className="h-10 w-64"
							id="desiredLevel"
							max={MAX_LEVEL}
							min={1}
							onChange={(event) => setDesiredLevel(event.target.value)}
							placeholder="Enter the desired level…"
							type="number"
							value={desiredLevel}
						/>
					</div>
					<div className="flex flex-col items-start gap-2">
						<label className="font-medium text-sm text-white/75" htmlFor="currentLevel">
							Current Level
						</label>
						<Input
							className="h-10 w-64"
							id="currentLevel"
							max={MAX_LEVEL}
							min={1}
							onChange={(event) => setCurrentLevel(event.target.value)}
							placeholder="Enter the current level…"
							type="number"
							value={currentLevel}
						/>
					</div>
					<div className="flex flex-col items-start gap-2">
						<label className="font-medium text-sm text-white/75" htmlFor="multiplier">
							Leveling Multiplier
						</label>
						<Input
							className="h-10 w-64"
							id="multiplier"
							max={MAX_XP_MULTIPLIER_VALUE}
							min={MIN_XP_MULTIPLIER_VALUE}
							onChange={(event) => setMultiplier(event.target.value)}
							placeholder="Enter a leveling multiplier…"
							step={MIN_XP_MULTIPLIER_VALUE}
							type="number"
							value={multiplier}
						/>
					</div>
				</div>

				<div className="flex flex-col items-center gap-5 md:flex-row">
					<div className="flex flex-col items-start gap-2">
						<label className="font-medium text-sm text-white/75" htmlFor="xpGainInterval">
							XP Gain Interval (seconds)
						</label>
						<Input
							className="h-10 w-64"
							id="xpGainInterval"
							max={MAX_XP_GAIN_INTERVAL / 1000}
							min={MIN_XP_GAIN_INTERVAL / 1000}
							onChange={(event) => setXpGainInterval(event.target.value)}
							placeholder="60"
							type="number"
							value={xpGainInterval}
						/>
					</div>
					<div className="flex flex-col items-start gap-2">
						<label className="font-medium text-sm text-white/75" htmlFor="xpPerMessageMin">
							Min XP per Message
						</label>
						<Input
							className="h-10 w-64"
							id="xpPerMessageMin"
							max={MAX_XP_PER_MESSAGE}
							min={MIN_XP_PER_MESSAGE}
							onChange={(event) => setXpPerMessageMin(event.target.value)}
							placeholder="15"
							type="number"
							value={xpPerMessageMin}
						/>
					</div>
					<div className="flex flex-col items-start gap-2">
						<label className="font-medium text-sm text-white/75" htmlFor="xpPerMessageMax">
							Max XP per Message
						</label>
						<Input
							className="h-10 w-64"
							id="xpPerMessageMax"
							max={MAX_XP_PER_MESSAGE}
							min={MIN_XP_PER_MESSAGE}
							onChange={(event) => setXpPerMessageMax(event.target.value)}
							placeholder="40"
							type="number"
							value={xpPerMessageMax}
						/>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center gap-5 md:flex-row">
				<InfoSection raw={approxMessages} title="Approx. Messages" tooltip={APPROXIMATE_MESSAGES_TOOLTIP}>
					{formatNumber(approxMessages)}
				</InfoSection>
				<InfoSection title="Estimated Time" tooltip={ESTIMATED_TIME_TOOLTIP}>
					{prettySeconds(estimatedTime)}
				</InfoSection>
				<InfoSection raw={expRequired} title="Exp. Required" tooltip={EXPERIENCE_REQUIRED_TOOLTIP}>
					{formatNumber(expRequired)}
				</InfoSection>
			</div>
		</>
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

	if (
		Number.isNaN(desiredLevel_) ||
		desiredLevel_ > MAX_LEVEL ||
		desiredLevel_ <= 0 ||
		currentLevel_ > MAX_LEVEL ||
		currentLevel_ < 0 ||
		multiplier_ < MIN_XP_MULTIPLIER_VALUE ||
		multiplier_ > MAX_XP_MULTIPLIER_VALUE ||
		desiredLevel_ <= currentLevel_ ||
		xpGainInterval_ < MIN_XP_GAIN_INTERVAL / 1000 ||
		xpGainInterval_ > MAX_XP_GAIN_INTERVAL / 1000 ||
		xpPerMessageMin_ < MIN_XP_PER_MESSAGE ||
		xpPerMessageMin_ > MAX_XP_PER_MESSAGE ||
		xpPerMessageMax_ < MIN_XP_PER_MESSAGE ||
		xpPerMessageMax_ > MAX_XP_PER_MESSAGE ||
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
