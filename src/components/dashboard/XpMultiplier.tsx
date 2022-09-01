import { MdClear } from "react-icons/md";
import {
	MultiplierType,
	type DashboardChannels,
	type DashboardDatabaseGuild,
	type DashboardRoles,
} from "../../graphql/queries/DashboardGuild";
import type { Snowflake } from "../../utils/constants";
import { getDatabaseLimit } from "../../utils/utils";
import Input from "../form/Input";
import Selector from "../form/Selector";

export type XpMultiplierOnDeleteFn = (id: string) => unknown;
export type XpMultiplierOnItemChangeFn = (itemIds: Snowflake[], id: string) => unknown;
export type XpMultiplierOnMultiplierChangeFn = (multiplier: string, id: string) => unknown;

interface XpMultiplierProps {
	channels: DashboardChannels;
	id: string;
	multiplier: string;
	onDelete: XpMultiplierOnDeleteFn;
	onItemChange: XpMultiplierOnItemChangeFn;
	onMultiplierChange: XpMultiplierOnMultiplierChangeFn;
	premium: boolean;
	roles: DashboardRoles;
	targets: Snowflake[] | null;
	type: DashboardDatabaseGuild["xpMultipliers"][0]["type"];
}

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
	return (
		<div className="relative flex w-full flex-row flex-wrap justify-between gap-y-2 rounded-lg bg-discord-dark p-2">
			<div className="flex w-full">
				<label className="ml-4 flex w-[6rem] items-center font-bold text-white" htmlFor={`m-${id}-selector`}>
					{type[0].toUpperCase() + type.slice(1)}
				</label>

				<div className="w-[6rem]">
					<Input
						id={`m-${id}-input`}
						initialValue={multiplier.toString()}
						maxLength={5}
						onChange={(text) => onMultiplierChange(text, id)}
						placeholder="1.0"
						prefix="x"
						noClearButton
					/>
				</div>

				<div
					className="right-0 mr-4 ml-auto h-full w-6 cursor-pointer py-3 text-2xl text-discord-red transition-colors active:text-red-600"
					onClick={() => onDelete(id)}
				>
					<MdClear />
				</div>
			</div>

			{type !== MultiplierType.Global && targets && (
				<div className="mx-2 w-full">
					<Selector
						id={`m-${id}-selector`}
						limit={getDatabaseLimit("xpMultiplierTargets", premium).maxLength}
						initialItems={targets}
						items={type === MultiplierType.Channel ? channels : roles}
						onSelect={(ids) => onItemChange(ids, id)}
						type={type === MultiplierType.Channel ? "channel" : "role"}
					/>
				</div>
			)}
		</div>
	);
}
