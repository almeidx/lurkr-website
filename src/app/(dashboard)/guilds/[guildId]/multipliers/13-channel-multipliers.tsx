import "client-only";
// The reason for using "client-only" instead of "use client" is because of the function parameter in the component,
// which triggers a warning since functions are not serializable.

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { AddComment } from "@/components/icons/mdi/add-comment.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import {
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
	MIN_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { type Channel, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";
import { type Dispatch, type SetStateAction, useState } from "react";
import { CreateMultiplierButton } from "./create-multiplier-button.tsx";

export function ChannelMultipliers({
	channels,
	multipliers,
	premium,
	multiplierCount,
	setMultiplierCount,
}: ChannelMultipliersProps) {
	const [channelMultipliers, setChannelMultipliers] = useState<XpMultiplier[]>(() =>
		multipliers.filter((multiplier) => multiplier.type === XpMultiplierType.Channel),
	);
	const [newChannels, setNewChannels] = useState<readonly Channel[]>([]);
	const [newMultiplier, setNewMultiplier] = useState<string>("");

	const existingMultiplierValues = channelMultipliers.map(({ multiplier }) => multiplier);

	const maxMultipliers = getMaximumLimit("xpMultipliers", premium);

	function handleCreateMultiplier() {
		const multiplier = Number.parseFloat(newMultiplier);
		const channelIds = newChannels.map(({ id }) => id);

		const maxTargets = getMaximumLimit("xpMultiplierTargets", premium);

		if (
			Number.isNaN(multiplier) ||
			multiplier < MIN_XP_MULTIPLIER_VALUE ||
			multiplier > MAX_XP_MULTIPLIER_VALUE ||
			channelIds.length === 0 ||
			channelIds.length > maxTargets ||
			multiplierCount >= maxMultipliers
		) {
			return;
		}

		setChannelMultipliers((prev) =>
			[...prev, { id: crypto.randomUUID(), multiplier, targets: channelIds, type: XpMultiplierType.Channel }].sort(
				(a, b) => a.multiplier - b.multiplier,
			),
		);

		setNewChannels([]);
		setNewMultiplier("");
		setMultiplierCount((prev) => prev + 1);
	}

	function handleDeleteMultiplier(id: string) {
		setChannelMultipliers((prev) => prev.filter((multiplier) => multiplier.id !== id));
		setMultiplierCount((prev) => prev - 1);
	}

	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your channels:</Text>

				<ChannelSelector
					channels={channels}
					defaultValues={[]}
					inputId="channel-selector"
					max={getMaximumLimit("xpMultiplierTargets", premium)}
					menuPlacement="top" // Placing the menu on top always to avoid overflow
					settingId="newChannels"
					onChange={(newChannels) => setNewChannels(newChannels)}
				/>

				<Text>and the multiplier to apply to them:</Text>

				<Input
					id="newLevel"
					placeholder="Enter a multiplier…"
					type="number"
					value={newMultiplier}
					min={MIN_XP_MULTIPLIER_VALUE}
					max={MAX_XP_MULTIPLIER_VALUE}
					step={MIN_XP_MULTIPLIER_VALUE}
					onChange={(event) => setNewMultiplier(event.target.value)}
				/>

				<CreateMultiplierButton
					handleCreateMultiplier={handleCreateMultiplier}
					maxMultipliers={maxMultipliers}
					multiplierCount={multiplierCount}
					newMultiplier={newMultiplier}
					newTargets={newChannels}
					existingMultiplierValues={existingMultiplierValues}
				>
					<AddComment className="size-6 text-white" />
				</CreateMultiplierButton>
			</div>

			{channelMultipliers.length ? (
				<>
					<Label
						sub={`Max. ${MAX_XP_MULTIPLIER_TARGETS} channels total - Max. ${MAX_XP_MULTIPLIER_TARGETS_PREMIUM} for Premium`}
					>
						Manage your channel multipliers…
					</Label>

					{channelMultipliers.map((multiplier) => (
						<ChannelMultiplier
							key={multiplier.id}
							{...multiplier}
							channels={channels}
							premium={premium}
							onDelete={handleDeleteMultiplier}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function ChannelMultiplier({ id, multiplier, premium, onDelete, channels, targets }: ChannelMultiplierProps) {
	const resolvedChannels = mapChannelIdsToChannels(targets, channels);

	return (
		<div className="flex items-center gap-4">
			<button
				className="group relative flex size-10 items-center justify-center rounded-lg border border-white/25 bg-darker text-[#fff] text-lg md:text-xl"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden size-10 items-center justify-center rounded-lg border border-red bg-darker group-hover:flex">
					<Delete className="size-5 text-[#ed4245]" />
				</div>

				{multiplier}
			</button>

			<ChannelSelector
				channels={channels}
				defaultValues={resolvedChannels}
				inputId={`channel-multipliers-${id}`}
				max={getMaximumLimit("xpMultiplierTargets", premium)}
				settingId={`xpMultipliers-${XpMultiplierType.Channel}-${multiplier}-${id}`}
			/>
		</div>
	);
}

type ChannelMultiplierProps = Omit<XpMultiplier, "type"> & {
	readonly channels: Channel[];
	onDelete(id: string): void;
	readonly premium: boolean;
};

interface ChannelMultipliersProps {
	readonly channels: Channel[];
	readonly multipliers: XpMultiplier[];
	readonly premium: boolean;
	readonly multiplierCount: number;
	readonly setMultiplierCount: Dispatch<SetStateAction<number>>;
}
