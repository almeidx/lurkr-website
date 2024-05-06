"use client";

import { CreateMultiplierButton } from "@/app/guilds/[guildId]/multipliers/create-multiplier-button.tsx";
import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import {
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
	MIN_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { type Channel, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { BiSolidTrash } from "@react-icons/all-files/bi/BiSolidTrash";
import { MdAddComment } from "@react-icons/all-files/md/MdAddComment";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";

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
				>
					<MdAddComment color="white" size={24} />
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
	const resolvedChannels = useMemo(
		() => targets.map((channelId) => channels.find((channel) => channel.id === channelId)!).filter(Boolean),
		[targets, channels],
	);

	return (
		<div className="flex items-center gap-4">
			<button
				className="group relative flex size-10 items-center justify-center rounded-lg border border-white/25 bg-[#1e1f22] text-lg text-[#fff] md:text-xl"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden size-10 items-center justify-center rounded-lg border border-red bg-[#1e1f22] group-hover:flex">
					<BiSolidTrash color="#ed4245" size={19} />
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
