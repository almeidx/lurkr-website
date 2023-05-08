"use client";

import { FaGlobe, FaUserFriends } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { MdClear } from "react-icons/md";
import Input from "@/form/Input";
import Selector from "@/form/Selector";
import { XpMultiplierType, type Channel, type Role } from "~/contexts/GuildContext";
import type { Snowflake } from "~/utils/constants";
import { MAX_XP_MULTIPLIER_TARGETS, MAX_XP_MULTIPLIER_TARGETS_PREMIUM } from "~/utils/guild-config";

export default function XpMultiplier({
	channels,
	id,
	multiplier,
	onDelete,
	onItemChange,
	onMultiplierChange,
	premium,
	roles,
	targets,
	type,
}: XpMultiplierProps) {
	const Icon =
		type === XpMultiplierType.Channel ? IoMdChatbubbles : type === XpMultiplierType.Role ? FaUserFriends : FaGlobe;

	return (
		<div className="bg-discord-dark relative flex w-full flex-row flex-wrap justify-between gap-y-2 rounded-lg p-2">
			<div className="flex w-full">
				<label
					className="ml-4 flex w-28 flex-row items-center gap-2 text-center font-bold text-white"
					htmlFor={`m-${id}-selector`}
				>
					<Icon />
					{type[0]!.toUpperCase() + type.slice(1)}
				</label>

				<div className="w-24">
					<Input
						id={`m-${id}-input`}
						initialValue={multiplier.toString()}
						maxLength={5}
						noClearButton
						onChange={(text) => onMultiplierChange(text, id)}
						placeholder="1.0"
						prefix="x"
					/>
				</div>

				<div
					className="text-discord-red right-0 ml-auto mr-4 h-full w-6 cursor-pointer py-3 text-2xl transition-colors active:text-red-600"
					onClick={() => onDelete(id)}
				>
					<MdClear />
				</div>
			</div>

			{type !== XpMultiplierType.Global && targets && (
				<div className="mx-2 w-full">
					<Selector
						id={`m-${id}-selector`}
						initialItems={targets}
						items={type === XpMultiplierType.Channel ? channels : roles}
						limit={premium ? MAX_XP_MULTIPLIER_TARGETS_PREMIUM : MAX_XP_MULTIPLIER_TARGETS}
						onSelect={(ids) => onItemChange(ids, id)}
						type={type}
					/>
				</div>
			)}
		</div>
	);
}

export type XpMultiplierOnDeleteFn = (id: string) => unknown;
export type XpMultiplierOnItemChangeFn = (itemIds: Snowflake[], id: string) => unknown;
export type XpMultiplierOnMultiplierChangeFn = (multiplier: string, id: string) => unknown;

interface XpMultiplierProps {
	channels: Channel[];
	id: string;
	multiplier: string;
	onDelete: XpMultiplierOnDeleteFn;
	onItemChange: XpMultiplierOnItemChangeFn;
	onMultiplierChange: XpMultiplierOnMultiplierChangeFn;
	premium: boolean;
	roles: Role[];
	targets: Snowflake[] | null;
	type: XpMultiplierType;
}
