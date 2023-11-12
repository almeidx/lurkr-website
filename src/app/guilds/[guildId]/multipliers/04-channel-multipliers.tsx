"use client";

import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { type Channel, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { BiSolidTrash } from "@react-icons/all-files/bi/BiSolidTrash";
import { MdAddComment } from "@react-icons/all-files/md/MdAddComment";
import { useMemo, useState } from "react";

export function ChannelMultipliers({ channels, multipliers, premium }: ChannelMultipliersProps) {
	const [channelMultipliers, setChannelMultipliers] = useState<XpMultiplier[]>(() =>
		multipliers.filter((multiplier) => multiplier.type === XpMultiplierType.Channel),
	);
	const [newChannels, setNewChannels] = useState<readonly Channel[]>([]);
	const [newMultiplier, setNewMultiplier] = useState<string>("");

	function handleCreateMultiplier() {
		const multiplier = Number.parseFloat(newMultiplier);
		const channelIds = newChannels.map(({ id }) => id);

		if (
			Number.isNaN(multiplier) ||
			multiplier < 1 ||
			multiplier > 100 ||
			channelIds.length === 0 ||
			channelIds.length > 25
		) {
			return;
		}

		setChannelMultipliers((prev) =>
			[
				...prev,
				{
					id: crypto.randomUUID(),
					multiplier,
					targets: channelIds,
					type: XpMultiplierType.Channel,
				},
			].sort((a, b) => a.multiplier - b.multiplier),
		);

		setNewChannels([]);
		setNewMultiplier("");
	}

	function handleDeleteMultiplier(id: string) {
		setChannelMultipliers((prev) => prev.filter((multiplier) => multiplier.id !== id));
	}

	return (
		<>
			<Text htmlFor="channel-selector" docsPath="/guides/setting-up-leveling-multipliers#setting-channel-multipliers">
				Setup channel multipliers that only apply to members chatting in those channels…
			</Text>

			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your channels:</Text>

				<ChannelSelector
					channels={channels}
					defaultValues={[]}
					inputId="channel-selector"
					max={getMaximumLimit("xpMultiplierTargets", premium)}
					settingId="newChannels"
					onChange={(newChannels) => setNewChannels(newChannels)}
				/>

				<Text>and the multiplier to apply to them:</Text>

				<input
					id="newLevel"
					placeholder="Enter a multiplier…"
					className="min-w-[12rem] max-w-3xl rounded-lg bg-light-gray p-2 px-3 shadow-dim-inner"
					type="number"
					value={newMultiplier}
					min={0.01}
					max={5}
					step={0.01}
					onChange={(event) => setNewMultiplier(event.target.value)}
				/>

				<button
					className="rounded-lg bg-green p-1 transition-colors hover:bg-green/75"
					onClick={handleCreateMultiplier}
					type="button"
				>
					<MdAddComment color="white" size={24} />
				</button>
			</div>

			<label className="flex items-end gap-2 text-lg tracking-tight text-white/75 md:text-xl">
				Manage your channel multipliers…
				<p className="mb-1 text-xs font-light text-white/50">(Max. 30 channels total - Max. 100 for Premium)</p>
			</label>

			{channelMultipliers.length ? (
				channelMultipliers.map((multiplier) => (
					<ChannelMultiplier
						key={multiplier.id}
						{...multiplier}
						channels={channels}
						premium={premium}
						onDelete={handleDeleteMultiplier}
					/>
				))
			) : (
				<p className="tracking-tight text-white/75">No channel multipliers yet!</p>
			)}
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
				className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-white bg-[#1e1f22] text-lg text-[#fff] md:text-xl"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden h-10 w-10 items-center justify-center rounded-lg border border-white bg-[#1e1f22] group-hover:flex">
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
}
