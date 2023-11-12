import { useContext, useEffect } from "react";
import Header from "@/dashboard/Header";
import { XpAnnounceChannel } from "@/dashboard/entries/XpAnnounceChannel";
import { AutoResetLevels } from "@/entries/AutoResetLevels";
import { NoXpRoles } from "@/entries/NoXpRoles";
import { PrioritiseMultiplierRoleHierarchy } from "@/entries/PrioritiseMultiplierRoleHierarchy";
import { StackXpRoles } from "@/entries/StackXpRoles";
import { TopXpRole } from "@/entries/TopXpRole";
import { Vanity } from "@/entries/Vanity";
import { XpAnnounceMiniumLevel } from "@/entries/XpAnnounceMinimumLevel";
import { XpAnnounceMultipleOf } from "@/entries/XpAnnounceMultipleOf";
import { XpAnnounceOnlyXpRoles } from "@/entries/XpAnnounceOnlyXpRoles";
import { XpAnnouncementLevels } from "@/entries/XpAnnouncementLevels";
import { XpChannels } from "@/entries/XpChannels";
import { XpDisallowedPrefixes } from "@/entries/XpDisallowedPrefixes";
import { XpInThreads } from "@/entries/XpInThreads";
import { XpMessage } from "@/entries/XpMessage";
import { XpMultipliers } from "@/entries/XpMultipliers";
import { XpRoleRewards } from "@/entries/XpRoleRewards";
import Fieldset from "@/form/Fieldset";
import { GuildContext, type Channel, type GuildSettings, type Role } from "~/contexts/GuildContext";

export default function Leveling({ channels, settings, roles, openMenu }: LevelingProps) {
	const { addChange, addMultipleChanges, data } = useContext(GuildContext);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Allow users to gain xp and level up by sending messages."
				extras={
					<a
						className={`${
							data?.levels && settings.levels
								? "bg-[#3ba55d] text-white hover:bg-green-700"
								: "pointer-events-none bg-gray-500/75 text-white/75"
						} flex h-fit items-center justify-center rounded-lg px-3 py-1 text-center transition-colors`}
						href={`/levels/${settings.id}`}
						rel="noreferrer"
						target="_blank"
					>
						Go to Leaderboard
					</a>
				}
				id="levels"
				initialValue={settings.levels}
				onChange={(state) => addChange("levels", state)}
				openMenu={openMenu}
				title="Leveling"
			/>

			<Fieldset>
				<XpAnnounceChannel addMultipleChanges={addMultipleChanges} channels={channels} settings={settings} />

				<XpMessage addChange={addChange} settings={settings} />

				<StackXpRoles addChange={addChange} settings={settings} />

				<PrioritiseMultiplierRoleHierarchy addChange={addChange} settings={settings} />

				<XpInThreads addChange={addChange} settings={settings} />

				<XpRoleRewards addChange={addChange} roles={roles} settings={settings} />

				<XpMultipliers addChange={addChange} channels={channels} roles={roles} settings={settings} />

				<XpChannels addChange={addChange} channels={channels} settings={settings} />

				<XpDisallowedPrefixes addChange={addChange} settings={settings} />

				<TopXpRole addChange={addChange} roles={roles} settings={settings} />

				<NoXpRoles addChange={addChange} roles={roles} settings={settings} />

				<AutoResetLevels addChange={addChange} settings={settings} />

				<Vanity addChange={addChange} settings={settings} />

				<XpAnnouncementLevels addChange={addChange} settings={settings} />

				<XpAnnounceMiniumLevel addChange={addChange} settings={settings} />

				<XpAnnounceMultipleOf addChange={addChange} settings={settings} />

				<XpAnnounceOnlyXpRoles addChange={addChange} settings={settings} />
			</Fieldset>
		</>
	);
}

interface LevelingProps {
	readonly channels: Channel[];
	openMenu(): void;
	readonly roles: Role[];
	readonly settings: GuildSettings;
}
