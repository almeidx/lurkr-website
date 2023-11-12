"use client";

import { InfoSection } from "@/app/levels/calculator/info-section.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { formatNumber } from "@/utils/format-number.ts";
import { prettySeconds } from "@/utils/pretty-seconds.ts";
import { useState } from "react";
import { APPROXIMATE_MESSAGES_TOOLTIP, ESTIMATED_TIME_TOOLTIP, EXPERIENCE_REQUIRED_TOOLTIP } from "./tooltips.ts";

const avgXpPerMessage = (15 + 40) / 2;
const timePerMessage = 60;
const MAX_LEVEL = 6_554;
const MAX_MULTIPLIER = 5;

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
					maxLength={4}
					onChange={(event) => setDesiredLevel(event.target.value)}
					placeholder="Enter the desired level…"
					type="number"
					value={desiredLevel}
				/>
				<Input
					className="h-10 w-64"
					id="currentLevel"
					maxLength={4}
					onChange={(event) => setCurrentLevel(event.target.value)}
					placeholder="Enter the current level…"
					type="number"
					value={currentLevel}
				/>
				<Input
					className="h-10 w-64"
					id="multiplier"
					maxLength={4}
					onChange={(event) => setMultiplier(event.target.value)}
					placeholder="Enter a leveling multiplier…"
					type="number"
					value={multiplier}
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
		multiplier_ <= 0 ||
		multiplier_ > MAX_MULTIPLIER ||
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
