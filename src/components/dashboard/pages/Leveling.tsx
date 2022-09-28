import cuid from "cuid";
import { useCallback, useContext, useEffect, useMemo, useRef, useState, type MouseEventHandler } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import {
	AutoResetLevels,
	GuildContext,
	XpMultiplierType,
	type Channel,
	type GuildSettings,
	type Role,
	type XpMultiplier as IXpMultiplier,
	type XpRoleReward,
} from "../../../contexts/GuildContext";
import { getDatabaseLimit, parseIntStrict, parseMultiplier } from "../../../utils/common";
import type { Snowflake } from "../../../utils/constants";
import BasicSelect from "../../form/BasicSelect";
import Field from "../../form/Field";
import Fieldset from "../../form/Fieldset";
import Input from "../../form/Input";
import Label from "../../form/Label";
import Selector from "../../form/Selector";
import Subtitle from "../../form/Subtitle";
import Textarea from "../../form/Textarea";
import Toggle from "../../form/Toggle";
import Header from "../Header";
import SmallClearableItem from "../SmallClearableItem";
import XpMultiplier, {
	type XpMultiplierOnDeleteFn,
	type XpMultiplierOnItemChangeFn,
	type XpMultiplierOnMultiplierChangeFn,
} from "../XpMultiplier";
import XpRole, { type XpRoleOnChangeFn } from "../XpRole";

interface LevelingProps {
	channels: Channel[];
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}

type MultiplierWithStringValue = Omit<IXpMultiplier, "multiplier"> & { multiplier: string };

enum ResponseType {
	CHANNEL = "custom-channel",
	DM = "dm",
	NONE = "none",
	SAME_CHANNEL = "channel",
}

function resolveXpResponseTypeByName(name: string) {
	return name === "Custom Channel"
		? ResponseType.CHANNEL
		: name === "DM"
		? ResponseType.DM
		: name === "None"
		? ResponseType.NONE
		: ResponseType.SAME_CHANNEL;
}

function resolveInitialXpResponseType(settings: GuildSettings) {
	return settings.xpResponseType
		? /^\d+$/.test(settings.xpResponseType)
			? "Custom Channel"
			: settings.xpResponseType === "dm"
			? "DM"
			: "Same Channel"
		: "None";
}

function resolveInitialXpResponseTypeValue(settings: GuildSettings) {
	return settings.xpResponseType
		? /^\d+$/.test(settings.xpResponseType)
			? ResponseType.CHANNEL
			: settings.xpResponseType
		: ResponseType.NONE;
}

function resolveAutoResetLevelsNameByType(type: AutoResetLevels) {
	return type === AutoResetLevels.Ban
		? "Ban"
		: type === AutoResetLevels.Leave
		? "Leave"
		: type === AutoResetLevels.Both
		? "Ban & Leave"
		: "None";
}

function resolveAutoResetLevelsTypeByName(name: string) {
	return name === "Ban & Leave"
		? AutoResetLevels.Both
		: name === "Ban"
		? AutoResetLevels.Ban
		: name === "Leave"
		? AutoResetLevels.Leave
		: AutoResetLevels.None;
}

function resolveInitialXpResponseChannel(settings: GuildSettings): Snowflake[] {
	return settings.xpResponseType ? (/^\d+$/.test(settings.xpResponseType) ? [settings.xpResponseType] : []) : [];
}

function resolveMultiplierValues(multipliers: MultiplierWithStringValue[]) {
	return multipliers.map((multiplier) => ({
		...multiplier,
		multiplier: parseMultiplier(multiplier.multiplier) ?? Number.NaN,
	}));
}

let timeout: NodeJS.Timeout | undefined;

export default function Leveling({ channels, settings, roles, openMenu }: LevelingProps) {
	const [xpRoleRewards, setXpRoleRewards] = useState<XpRoleReward[]>(settings.xpRoleRewards);
	const [xpChannels, setXpChannels] = useState<Snowflake[]>(
		(settings.xpWhitelistedChannels as Snowflake[] | null) ??
			(settings.xpBlacklistedChannels as Snowflake[] | null) ??
			[],
	);
	const [xpMultipliers, setXpMultipliers] = useState<MultiplierWithStringValue[]>(
		settings.xpMultipliers.map((multiplier) => ({
			...multiplier,
			multiplier: multiplier.multiplier.toString(),
		})),
	);
	const [xpResponseType, setXpResponseType] = useState<string>(resolveInitialXpResponseTypeValue(settings));
	const [xpChannelsType, setXpChannelsType] = useState<"blacklist" | "whitelist">(
		settings.xpBlacklistedChannels ? "blacklist" : "whitelist",
	);
	const [newXpMultiplierType, setNewXpMultiplierType] = useState<XpMultiplierType>(XpMultiplierType.Channel);
	const [newXpRolesLevel, setNewXpRolesLevel] = useState<string>("");
	const [newDisallowedPrefix, setNewDisallowedPrefix] = useState<string>("");
	const [xpDisallowedPrefixes, setXpDisallowedPrefixes] = useState<string[]>(settings.xpDisallowedPrefixes);
	const [xpAnnounceLevels, setXpAnnounceLevels] = useState<number[]>(settings.xpAnnounceLevels);
	const [newXpAnnounceLevel, setNewXpAnnounceLevel] = useState<string>("");
	const newXpRoleSubmitRef = useRef<HTMLButtonElement>(null);
	const newXpDisallowedPrefixSubmitRef = useRef<HTMLButtonElement>(null);
	const newXpAnnounceLevelsSubmitRef = useRef<HTMLButtonElement>(null);
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { addChange } = useContext(GuildContext);

	const noXpRolesLimit = getDatabaseLimit("noXpRoles", settings.premium).maxLength;
	const vanityLimits = getDatabaseLimit("vanity", settings.premium);
	const xpMessageLimit = getDatabaseLimit("xpMessage", settings.premium).maxLength;
	const xpChannelsLimit = getDatabaseLimit("xpChannels", settings.premium).maxLength;
	const xpDisallowedPrefixesLimit = getDatabaseLimit("xpDisallowedPrefixes", settings.premium).maxLength;
	const xpAnnounceLevelsLimit = getDatabaseLimit("xpAnnounceLevels", settings.premium).maxLength;
	const xpAnnounceLevelLimits = getDatabaseLimit("xpAnnounceLevel", settings.premium);
	const xpAnnounceMinimumLevelLimits = getDatabaseLimit("xpAnnounceMinimumLevel", settings.premium);
	const xpAnnounceMultipleOfLimits = getDatabaseLimit("xpAnnounceMultipleOf", settings.premium);

	useEffect(() => {
		window.scroll({
			behavior: "auto",
			left: 0,
			top: 0,
		});
	}, [openMenu]);

	const sortedRoleRewards = useMemo(() => xpRoleRewards.sort((a, b) => a.level - b.level), [xpRoleRewards]);

	const handleNewXpRoleCreated: () => unknown = useCallback(() => {
		const clone = [...xpRoleRewards];
		const level = parseIntStrict(newXpRolesLevel);

		if (Number.isNaN(level) || clone.some((roleReward) => roleReward.level === level) || level <= 0 || level > 500) {
			if (newXpRoleSubmitRef.current) {
				newXpRoleSubmitRef.current.style.color = "#ed4245";
			}

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				if (newXpRoleSubmitRef.current) {
					newXpRoleSubmitRef.current.style.color = "#fff";
				}
			}, 1_000);
		} else {
			clone.push({ level, roleIds: [] });

			setXpRoleRewards(clone);
			addChange("xpRoleRewards", clone);
		}
	}, [addChange, newXpRolesLevel, xpRoleRewards, newXpRoleSubmitRef]);

	const handleXpRolesChange: XpRoleOnChangeFn = useCallback(
		(roleIds, level) => {
			const clone = [...xpRoleRewards];

			const index = clone.findIndex((role) => role.level === level);

			if (roleIds.length) {
				if (index === -1) {
					clone.push({
						level,
						roleIds,
					});
				} else {
					clone[index]!.roleIds = roleIds;
				}
			} else {
				clone.splice(index, 1);
			}

			setXpRoleRewards(clone);
			addChange("xpRoleRewards", clone);
		},
		[addChange, xpRoleRewards],
	);

	const handleXpChannelsTypeChange: MouseEventHandler<HTMLButtonElement> = useCallback(
		(event) => {
			event.preventDefault();

			const currentType = `${xpChannelsType}` as const;
			setXpChannelsType(currentType === "blacklist" ? "whitelist" : "blacklist");

			if (currentType === "blacklist") {
				addChange("xpBlacklistedChannels", []);
				addChange("xpWhitelistedChannels", xpChannels);
				return;
			}

			addChange("xpWhitelistedChannels", []);
			addChange("xpBlacklistedChannels", xpChannels);
		},
		[addChange, xpChannels, xpChannelsType],
	);

	const handleXpMultiplierDelete: XpMultiplierOnDeleteFn = useCallback(
		(id) => {
			const clone = [...xpMultipliers];
			const index = clone.findIndex((multiplier) => multiplier.id === id);

			if (index < 0) {
				console.log(
					"[Leveling] Id provided was not presented in the xp multipliers array when the user tried deleting a multiplier",
				);
				return;
			}

			clone.splice(index, 1);

			setXpMultipliers(clone);
			addChange("xpMultipliers", resolveMultiplierValues(clone));
		},
		[addChange, xpMultipliers],
	);

	const handleXpMultiplierItemsChange: XpMultiplierOnItemChangeFn = useCallback(
		(itemIds, id) => {
			const clone = [...xpMultipliers];
			const index = clone.findIndex((multiplier) => multiplier.id === id);

			if (index < 0) {
				console.log(
					"[Leveling] Id provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier",
				);
				return;
			}

			const multiplier = clone[index]!;
			if (!multiplier.targets) {
				console.log(
					"[Leveling] The multiplier found did not have targets when the user tried changing the items of a multiplier",
				);
				return;
			}

			multiplier.targets = itemIds;
			clone[index] = multiplier;

			setXpMultipliers(clone);
			addChange("xpMultipliers", resolveMultiplierValues(clone));
		},
		[addChange, xpMultipliers],
	);

	const handleXpMultiplierValueChange: XpMultiplierOnMultiplierChangeFn = useCallback(
		(multiplier, id) => {
			const clone = [...xpMultipliers];
			const index = clone.findIndex((multiplier) => multiplier.id === id);

			if (index < 0) {
				console.log(
					"[Leveling] Index provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier",
				);
				return;
			}

			const xpMultiplier = clone[index]!;
			xpMultiplier.multiplier = multiplier;

			clone[index] = xpMultiplier;

			setXpMultipliers(clone);
			addChange("xpMultipliers", resolveMultiplierValues(clone));
		},
		[addChange, xpMultipliers],
	);

	return (
		<>
			<Header
				openMenu={openMenu}
				description="Allow users to gain xp and level up by sending messages."
				id="levels"
				initialValue={settings.levels}
				onChange={(state) => addChange("levels", state)}
				title="Leveling"
			/>

			<Fieldset>
				<Field>
					<Label
						htmlFor="xpResponseType"
						name="Level Up Message Destination"
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#where-to-send-the-level-up-message"
					/>
					<div className="flex flex-row flex-wrap gap-y-2">
						<div className="w-full lg:w-1/2">
							<BasicSelect
								closeOnSelect
								initialItem={resolveInitialXpResponseType(settings)}
								items={["Same Channel", "DM", "Custom Channel", "None"]}
								onSelect={(item) => {
									const type = resolveXpResponseTypeByName(item);
									setXpResponseType(type);
									switch (type) {
										case ResponseType.DM:
										case ResponseType.SAME_CHANNEL:
											addChange("xpResponseType", type);
											break;
										case ResponseType.NONE:
											addChange("xpResponseType", null);
											break;
										default:
											addChange("xpResponseType", "123");
											break;
									}
								}}
							/>
						</div>
						<div className="w-full lg:w-1/2 lg:pl-2">
							{xpResponseType === ResponseType.CHANNEL && (
								<Selector
									id="xpResponseTypeChannel"
									initialItems={resolveInitialXpResponseChannel(settings)}
									items={channels}
									limit={1}
									onSelect={(channelIds) => addChange("xpResponseType", channelIds[0] ?? null)}
									type="Channel"
								/>
							)}
						</div>
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="xpMessage"
						name="Level Up Message"
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#customizing-the-level-up-message"
					/>
					<Textarea
						initialText={settings.xpMessage ?? ""}
						id="xpMessage"
						maxLength={xpMessageLimit}
						onChange={(text) => addChange("xpMessage", text)}
						placeholder="Enter the level up message"
					/>
					<Subtitle text={`Maximum of ${xpMessageLimit.toLocaleString("en")} characters.`} />
				</Field>

				<Field direction="row">
					<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
						<Label
							htmlFor="stackXpRoles"
							name="Stack Leveling Role Rewards"
							url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#toggling-role-stacking"
							withMargin={false}
						/>
						<Toggle
							size="small"
							id="stackXpRoles"
							initialValue={settings.stackXpRoles}
							onChange={(state) => addChange("stackXpRoles", state)}
						/>
					</div>
				</Field>

				<Field direction="row">
					<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
						<Label
							htmlFor="prioritiseMultiplierRoleHierarchy"
							name="Leveling Role Hierarchy/Multiplier Value Priority"
							url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers#changing-role-multiplier-hierarchy"
							withMargin={false}
						/>
						<Toggle
							size="small"
							id="prioritiseMultiplierRoleHierarchy"
							initialValue={settings.prioritiseMultiplierRoleHierarchy}
							onChange={(state) => addChange("prioritiseMultiplierRoleHierarchy", state)}
						/>
					</div>
				</Field>

				<Field direction="row">
					<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
						<Label
							htmlFor="xpInThreads"
							name="Leveling in Threads"
							url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#toggling-leveling-in-threads"
							withMargin={false}
						/>
						<Toggle
							size="small"
							id="xpInThreads"
							initialValue={settings.xpInThreads}
							onChange={(state) => addChange("xpInThreads", state)}
						/>
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="xpRoleRewards"
						name="Leveling Role Rewards"
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-role-rewards"
					/>
					<div className="mb-4 divide-y-2">
						{xpRoleRewards.length < getDatabaseLimit("xpRoleRewards", settings.premium).maxLength && (
							<div className="flex max-w-md flex-col gap-2">
								<p className="text-white">Create a new role reward</p>

								<Input
									clearOnSubmit
									id="newXpRole"
									initialValue={""}
									maxLength={3}
									onChange={(text) => (text ? /^\d+$/.test(text) && setNewXpRolesLevel(text) : setNewXpRolesLevel(""))}
									onSubmit={handleNewXpRoleCreated}
									placeholder="Enter a level to reward roles to"
									submitIcon={MdPlaylistAdd}
									submitRef={newXpRoleSubmitRef}
								/>
							</div>
						)}
					</div>
					<div className="mb-4 flex flex-col gap-y-2">
						{sortedRoleRewards.map(({ level, roleIds }) => (
							<XpRole
								key={level}
								level={level}
								initialRoles={roleIds}
								premium={settings.premium}
								onChange={handleXpRolesChange}
								roles={roles}
							/>
						))}
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="xpMultipliers"
						name="Leveling Multipliers"
						url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers"
					/>
					<div>
						{xpMultipliers.length < getDatabaseLimit("xpMultipliers", settings.premium).maxLength && (
							<div className="flex max-w-md flex-col">
								<p className="text-white">Create a new multiplier</p>
								<div className="mt-2 mb-4 flex flex-row gap-3">
									<BasicSelect
										closeOnSelect
										initialItem="Channel"
										items={
											xpMultipliers.some((multiplier) => multiplier.type === XpMultiplierType.Global)
												? ["Channel", "Role"]
												: ["Channel", "Global", "Role"]
										}
										onSelect={(type) => setNewXpMultiplierType(type as XpMultiplierType)}
									/>
									<button
										className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-discord-not-quite-black text-white transition-colors duration-150 hover:text-opacity-75"
										onClick={(event) => {
											event.preventDefault();

											const finalMultipliers = [
												...xpMultipliers,
												{ id: cuid(), multiplier: "1", targets: [], type: newXpMultiplierType },
											];
											setXpMultipliers(finalMultipliers);
											addChange("xpMultipliers", resolveMultiplierValues(finalMultipliers));
										}}
										type="button"
									>
										<MdPlaylistAdd className="fill-current text-3xl" />
									</button>
								</div>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-y-2">
						{xpMultipliers.map(({ id, multiplier, targets, type }) => (
							<XpMultiplier
								channels={channels}
								id={id}
								key={id}
								multiplier={multiplier}
								onDelete={handleXpMultiplierDelete}
								onItemChange={handleXpMultiplierItemsChange}
								onMultiplierChange={handleXpMultiplierValueChange}
								premium={settings.premium}
								roles={roles}
								targets={targets as Snowflake[]}
								type={type}
							/>
						))}
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="xpChannels"
						name={`Leveling Channels (${xpChannelsType === "blacklist" ? "Blacklist" : "Whitelist"})`}
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-allowed-channels"
					/>
					<div className="mb-3 flex flex-row justify-start">
						<button
							className="w-fit rounded-md bg-discord-not-quite-black py-1.5 px-2 text-white shadow-sm transition-colors duration-150 focus:outline-none active:bg-discord-dark"
							onClick={handleXpChannelsTypeChange}
							type="button"
						>
							Use {xpChannelsType === "blacklist" ? "Whitelist" : "Blacklist"}
						</button>
					</div>
					<Selector
						id="xpChannels"
						initialItems={
							settings.xpBlacklistedChannels?.length
								? settings.xpBlacklistedChannels
								: settings.xpWhitelistedChannels?.length
								? settings.xpWhitelistedChannels
								: []
						}
						items={channels}
						limit={xpChannelsLimit}
						onSelect={(channelIds) => {
							setXpChannels(channelIds);
							addChange(xpChannelsType === "whitelist" ? "xpWhitelistedChannels" : "xpBlacklistedChannels", channelIds);
						}}
						type="Channel"
					/>
					<Subtitle text={`Maximum of ${xpChannelsLimit} channels.`} />
				</Field>

				<Field>
					<Label
						htmlFor="xpDisallowedPrefixes"
						name="Ignored Leveling Bot Prefixes"
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#blacklisting-bot-prefixes"
					/>

					<div className="max-w-md divide-y-2">
						<Input
							clearOnSubmit
							id="newXpDisallowedPrefix"
							initialValue=""
							maxLength={12}
							onChange={(text) => setNewDisallowedPrefix(text)}
							onSubmit={() => {
								if (
									!xpDisallowedPrefixes.includes(newDisallowedPrefix) &&
									xpDisallowedPrefixes.length < xpDisallowedPrefixesLimit
								) {
									const newArr = [...xpDisallowedPrefixes, newDisallowedPrefix];
									setXpDisallowedPrefixes(newArr);
									addChange("xpDisallowedPrefixes", newArr);
								}
							}}
							placeholder="Enter a prefix to add to the disallowed list"
							submitIcon={MdPlaylistAdd}
							submitRef={newXpDisallowedPrefixSubmitRef}
						/>
					</div>

					{Boolean(xpDisallowedPrefixes.length) && (
						<div className="my-4 flex flex-row flex-wrap gap-2">
							{xpDisallowedPrefixes.map((prefix, index) => (
								<SmallClearableItem
									index={index}
									key={prefix}
									item={prefix}
									onDelete={(index) => {
										const clone = [...xpDisallowedPrefixes];
										clone.splice(index, 1);
										setXpDisallowedPrefixes(clone);
										addChange("xpDisallowedPrefixes", clone);
									}}
								/>
							))}
						</div>
					)}

					<Subtitle text={`Maximum of ${xpDisallowedPrefixesLimit} prefixes.`} />
				</Field>

				<Field>
					<Label
						htmlFor="topXpRole"
						name="Daily Top Leveling Role"
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-the-top-xp-role"
					/>
					<div className="w-full max-w-md sm:min-w-[20rem]">
						<Selector
							id="topXpRole"
							initialItems={settings.topXpRole ? [settings.topXpRole] : []}
							items={roles}
							limit={1}
							onSelect={(roleIds) => addChange("topXpRole", roleIds[0] ?? null)}
							type="Role"
						/>
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="noXpRoles"
						name="No Leveling Roles"
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-no-xp-roles"
					/>
					<Selector
						id="noXpRoles"
						initialItems={(settings.noXpRoles as Snowflake[] | null) ?? []}
						items={roles}
						limit={noXpRolesLimit}
						onSelect={(roleIds) => addChange("noXpRoles", roleIds)}
						type="Role"
					/>
					<Subtitle text={`Maximum of ${noXpRolesLimit} roles.`} />
				</Field>

				<Field>
					<Label
						htmlFor="autoResetLevels"
						name="Automatic Level Resets"
						url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#automatically-resetting-levels"
					/>
					<div className="max-w-md">
						<BasicSelect
							closeOnSelect
							initialItem={resolveAutoResetLevelsNameByType(settings.autoResetLevels)}
							items={["None", "Leave", "Ban", "Ban & Leave"]}
							onSelect={(option) => addChange("autoResetLevels", resolveAutoResetLevelsTypeByName(option))}
						/>
					</div>
				</Field>

				<Field>
					<Label
						htmlFor="vanity"
						name="Leaderboard Vanity URL"
						url="https://docs.pepemanager.com/guides/setting-a-leaderboard-vanity-url"
					/>
					<div className="max-w-md">
						<Input
							id="vanity"
							initialValue={settings.vanity ?? ""}
							maxLength={32}
							onChange={(text) => addChange("vanity", text)}
							placeholder="Enter the vanity used for the leveling leaderboard"
						/>
					</div>
					<Subtitle text={`Between ${vanityLimits.minLength} - ${vanityLimits.maxLength} characters.`} />
				</Field>

				<Field>
					<Label htmlFor="xpAnnounceLevels" name="Specific Announcement Levels" url="https://google.com/" />

					<div className="max-w-md divide-y-2">
						<Input
							clearOnSubmit
							id="newXpAnnounceLevel"
							initialValue=""
							maxLength={3}
							onChange={(text) => setNewXpAnnounceLevel(text)}
							onSubmit={() => {
								const level = parseIntStrict(newXpAnnounceLevel);
								if (
									level >= xpAnnounceLevelLimits.min &&
									level <= xpAnnounceLevelLimits.max &&
									!xpAnnounceLevels.includes(level) &&
									xpAnnounceLevels.length < xpAnnounceLevelsLimit
								) {
									const newArr = [...xpAnnounceLevels, level];
									setXpAnnounceLevels(newArr);
									addChange("xpAnnounceLevels", newArr);
								}
							}}
							placeholder="Enter a level to add to the announce levels list"
							submitIcon={MdPlaylistAdd}
							submitRef={newXpAnnounceLevelsSubmitRef}
						/>
					</div>

					{Boolean(xpAnnounceLevels.length) && (
						<div className="my-4 flex flex-row flex-wrap gap-2">
							{xpAnnounceLevels.map((prefix, index) => (
								<SmallClearableItem
									index={index}
									key={prefix}
									item={prefix}
									onDelete={(index) => {
										const clone = [...xpAnnounceLevels];
										clone.splice(index, 1);
										setXpAnnounceLevels(clone);
										addChange("xpAnnounceLevels", clone);
									}}
								/>
							))}
						</div>
					)}

					<Subtitle text={`Maximum of ${xpAnnounceLevelsLimit} levels.`} />
				</Field>

				<Field>
					<Label
						htmlFor="xpAnnounceMinimumLevel"
						name="Minimum Leveling Announcement Threshold"
						url="https://google.com/"
					/>
					<div className="max-w-md">
						<Input
							id="xpAnnounceMinimumLevel"
							initialValue={settings.xpAnnounceMinimumLevel.toString()}
							maxLength={6}
							onChange={(text) => addChange("xpAnnounceMinimumLevel", text ? parseIntStrict(text) : 0)}
							placeholder="Enter the minimum threshold for leveling announcements"
						/>
					</div>
					<Subtitle
						text={`Between ${xpAnnounceMinimumLevelLimits.min} - ${xpAnnounceMinimumLevelLimits.max.toLocaleString(
							"en",
						)}.`}
					/>
				</Field>

				<Field>
					<Label htmlFor="xpAnnounceMultipleOf" name="Factor for Leveling Announcements" url="https://google.com/" />
					<div className="max-w-md">
						<Input
							id="xpAnnounceMultipleOf"
							initialValue={settings.xpAnnounceMultipleOf?.toString() ?? "1"}
							maxLength={6}
							onChange={(text) => addChange("xpAnnounceMultipleOf", text ? parseIntStrict(text) : 0)}
							placeholder="Enter the factor for leveling announcements"
						/>
					</div>
					<Subtitle
						text={`Between ${xpAnnounceMultipleOfLimits.min} - ${xpAnnounceMultipleOfLimits.max.toLocaleString("en")}.`}
					/>
				</Field>

				<Field direction="row">
					<div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
						<Label
							htmlFor="xpAnnounceOnlyXpRoles"
							name="Only Announce Level-Ups Together With Role Rewards"
							url="https://google.com/"
							withMargin={false}
						/>
						<Toggle
							size="small"
							id="xpAnnounceOnlyXpRoles"
							initialValue={settings.xpAnnounceOnlyXpRoles}
							onChange={(state) => addChange("xpAnnounceOnlyXpRoles", state)}
						/>
					</div>
				</Field>
			</Fieldset>
		</>
	);
}
