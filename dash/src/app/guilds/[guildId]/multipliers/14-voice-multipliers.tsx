import "client-only";

// The reason for using "client-only" instead of "use client" is because of the function parameter in the component,
// which triggers a warning since functions are not serializable.

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { AddComment } from "@/components/icons/mdi/add-comment.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import { type Channel, ChannelType, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import {
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
	MIN_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";
import { CreateMultiplierButton } from "./create-multiplier-button.tsx";

export function VoiceMultipliers({
	channels,
	multipliers,
	premium,
	multiplierCount,
	setMultiplierCount,
}: VoiceMultipliersProps) {
	const voiceChannels = useMemo(
		() =>
			channels.filter(
				(channel) => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice,
			),
		[channels],
	);

	const [voiceMultipliers, setVoiceMultipliers] = useState<XpMultiplier[]>(() =>
		multipliers.filter((multiplier) => multiplier.type === XpMultiplierType.Voice),
	);
	const [newChannels, setNewChannels] = useState<readonly Channel[]>([]);
	const [newMultiplier, setNewMultiplier] = useState<string>("");

	const existingMultiplierValues = voiceMultipliers.map(({ multiplier }) => multiplier);

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

		setVoiceMultipliers((prev) =>
			[...prev, { id: crypto.randomUUID(), multiplier, targets: channelIds, type: XpMultiplierType.Voice }].sort(
				(a, b) => a.multiplier - b.multiplier,
			),
		);

		setNewChannels([]);
		setNewMultiplier("");
		setMultiplierCount((prev) => prev + 1);
	}

	function handleDeleteMultiplier(id: string) {
		setVoiceMultipliers((prev) => prev.filter((multiplier) => multiplier.id !== id));
		setMultiplierCount((prev) => prev - 1);
	}

	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your voice channels:</Text>

				<ChannelSelector
					channels={voiceChannels}
					defaultValues={[]}
					inputId="voice-channel-selector"
					max={getMaximumLimit("xpMultiplierTargets", premium)}
					menuPlacement="top" // Placing the menu on top always to avoid overflow
					onChange={(newChannels) => setNewChannels(newChannels)}
					settingId="newChannels"
				/>

				<Text>and the multiplier to apply to them:</Text>

				<Input
					id="newVoiceMultiplier"
					max={MAX_XP_MULTIPLIER_VALUE}
					min={MIN_XP_MULTIPLIER_VALUE}
					onChange={(event) => setNewMultiplier(event.target.value)}
					placeholder="Enter a multiplier…"
					step={MIN_XP_MULTIPLIER_VALUE}
					type="number"
					value={newMultiplier}
				/>

				<CreateMultiplierButton
					existingMultiplierValues={existingMultiplierValues}
					handleCreateMultiplier={handleCreateMultiplier}
					maxMultipliers={maxMultipliers}
					multiplierCount={multiplierCount}
					newMultiplier={newMultiplier}
					newTargets={newChannels}
				>
					<AddComment className="size-6 text-white" />
				</CreateMultiplierButton>
			</div>

			{voiceMultipliers.length ? (
				<>
					<Label
						sub={`Max. ${MAX_XP_MULTIPLIER_TARGETS} channels per multiplier - Max. ${MAX_XP_MULTIPLIER_TARGETS_PREMIUM} for Premium`}
					>
						Manage your voice channel multipliers…
					</Label>

					{voiceMultipliers.map((multiplier) => (
						<VoiceMultiplier
							key={multiplier.id}
							{...multiplier}
							channels={voiceChannels}
							onDelete={handleDeleteMultiplier}
							premium={premium}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function VoiceMultiplier({ id, multiplier, premium, onDelete, channels, targets }: VoiceMultiplierProps) {
	const resolvedChannels = mapChannelIdsToChannels(targets, channels);

	return (
		<div className="flex items-center gap-4">
			<button
				aria-label={`Delete ${multiplier} voice channel multiplier`}
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
				inputId={`voice-multipliers-${id}`}
				max={getMaximumLimit("xpMultiplierTargets", premium)}
				required
				settingId={`xpMultipliers-${XpMultiplierType.Voice}-${multiplier}-${id}`}
			/>
		</div>
	);
}

type VoiceMultiplierProps = Omit<XpMultiplier, "type"> & {
	readonly channels: Channel[];
	onDelete(id: string): void;
	readonly premium: boolean;
};

interface VoiceMultipliersProps {
	readonly channels: Channel[];
	readonly multipliers: XpMultiplier[];
	readonly premium: boolean;
	readonly multiplierCount: number;
	readonly setMultiplierCount: Dispatch<SetStateAction<number>>;
}
