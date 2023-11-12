"use client";

import { InfoSection } from "@/app/levels/calculator/info-section.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { MAX_XP_MULTIPLIER_VALUE, MIN_XP_MULTIPLIER_VALUE } from "@/lib/guild-config.ts";
import { formatNumber } from "@/utils/format-number.ts";
import { prettySeconds } from "@/utils/pretty-seconds.ts";
import { useState } from "react";
import { APPROXIMATE_MESSAGES_TOOLTIP, ESTIMATED_TIME_TOOLTIP, EXPERIENCE_REQUIRED_TOOLTIP } from "./tooltips.ts";

const avgXpPerMessage = (15 + 40) / 2;
const timePerMessage = 60;
const MAX_LEVEL = 6_554;

export function Calculator() {
	const [desiredLevel, setDesiredLevel] = useState("");
	const [currentLevel, setCurrentLevel] = useState("");
	const [multiplier, setMultiplier] = useState("");

	const { approxMessages, estimatedTime, expRequired } = calculate(desiredLevel, currentLevel, multiplier);

	return (
		<>
			<div className="flex flex-col items-center gap-5 md:flex-row">
				<Input
					className="h-10 w-64"
					id="desiredLevel"
					placeholder="Enter the desired level…"
					min={1}
					max={MAX_LEVEL}
					type="number"
					value={desiredLevel}
					onChange={(event) => setDesiredLevel(event.target.value)}
				/>
				<Input
					className="h-10 w-64"
					id="currentLevel"
					placeholder="Enter the current level…"
					min={1}
					max={MAX_LEVEL}
					type="number"
					value={currentLevel}
					onChange={(event) => setCurrentLevel(event.target.value)}
				/>
				<Input
					className="h-10 w-64"
					id="multiplier"
					placeholder="Enter a leveling multiplier…"
					min={MIN_XP_MULTIPLIER_VALUE}
					step={MIN_XP_MULTIPLIER_VALUE}
					max={MAX_XP_MULTIPLIER_VALUE}
					type="number"
					value={multiplier}
					onChange={(event) => setMultiplier(event.target.value)}
				/>
			</div>

			<div className="flex flex-col items-center gap-5 md:flex-row">
				<InfoSection title="Approx. Messages" tooltip={APPROXIMATE_MESSAGES_TOOLTIP}>
					{approxMessages}
				</InfoSection>
				<InfoSection title="Estimated Time" tooltip={ESTIMATED_TIME_TOOLTIP}>
					{estimatedTime}
				</InfoSection>
				<InfoSection title="Exp. Required" tooltip={EXPERIENCE_REQUIRED_TOOLTIP}>
					{expRequired}
				</InfoSection>
			</div>
		</>
	);
}

function calculate(desiredLevel: string, currentLevel: string, multiplier: string) {
	const desiredLevel_ = Number.parseInt(desiredLevel, 10);
	const currentLevel_ = Number.parseInt(currentLevel, 10) || 0;
	const multiplier_ = Number.parseFloat(multiplier) || 1;

	if (
		Number.isNaN(desiredLevel_) ||
		desiredLevel_ > MAX_LEVEL ||
		desiredLevel_ <= 0 ||
		currentLevel_ > MAX_LEVEL ||
		currentLevel_ < 0 ||
		multiplier_ <= MIN_XP_MULTIPLIER_VALUE ||
		multiplier_ > MAX_XP_MULTIPLIER_VALUE ||
		desiredLevel_ <= currentLevel_
	) {
		return { approxMessages: "0", estimatedTime: "0", expRequired: "0" };
	}

	const expRequired = getRequiredXp(desiredLevel_) - getRequiredXp(currentLevel_);

	const approxMessages = Math.ceil(expRequired / avgXpPerMessage / multiplier_);
	const estimatedTime = prettySeconds(approxMessages * timePerMessage);

	return { expRequired: formatNumber(expRequired), approxMessages: formatNumber(approxMessages), estimatedTime };
}

function getRequiredXp(level: number): number {
	return level === 0 ? 0 : 100 + 50 * (level - 1) ** 2;
}
