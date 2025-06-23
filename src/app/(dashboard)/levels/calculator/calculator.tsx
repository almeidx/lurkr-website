"use client";

import { useState } from "react";
import { InfoSection } from "@/app/(dashboard)/levels/calculator/info-section.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { MAX_XP_MULTIPLIER_VALUE, MIN_XP_MULTIPLIER_VALUE } from "@/lib/guild-config.ts";
import { formatNumber } from "@/utils/format-number.ts";
import { prettySeconds } from "@/utils/pretty-seconds.ts";
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
					max={MAX_LEVEL}
					min={1}
					onChange={(event) => setDesiredLevel(event.target.value)}
					placeholder="Enter the desired level…"
					type="number"
					value={desiredLevel}
				/>
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
		multiplier_ < MIN_XP_MULTIPLIER_VALUE ||
		multiplier_ > MAX_XP_MULTIPLIER_VALUE ||
		desiredLevel_ <= currentLevel_
	) {
		return { approxMessages: 0, estimatedTime: 0, expRequired: 0 };
	}

	const expRequired = getRequiredXp(desiredLevel_) - getRequiredXp(currentLevel_);

	const approxMessages = Math.ceil(expRequired / avgXpPerMessage / multiplier_);
	const estimatedTime = approxMessages * timePerMessage;

	return { approxMessages, estimatedTime, expRequired };
}

function getRequiredXp(level: number): number {
	return level === 0 ? 0 : 100 + 50 * (level - 1) ** 2;
}
