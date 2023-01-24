import { useContext, useEffect } from "react";
import { GuildContext, type Channel, type GuildSettings, type Role } from "../../../contexts/GuildContext";
import Fieldset from "../../form/Fieldset";
import Header from "../Header";
import { AutoResetLevels } from "../entries/AutoResetLevels";
import { NoXpRoles } from "../entries/NoXpRoles";
import { PrioritiseMultiplierRoleHierarchy } from "../entries/PrioritiseMultiplierRoleHierarchy";
import { StackXpRoles } from "../entries/StackXpRoles";
import { TopXpRole } from "../entries/TopXpRole";
import { Vanity } from "../entries/Vanity";
import { XpAnnounceMiniumLevel } from "../entries/XpAnnounceMinimumLevel";
import { XpAnnounceMultipleOf } from "../entries/XpAnnounceMultipleOf";
import { XpAnnounceOnlyXpRoles } from "../entries/XpAnnounceOnlyXpRoles";
import { XpAnnouncementLevels } from "../entries/XpAnnouncementLevels";
import { XpChannels } from "../entries/XpChannels";
import { XpDisallowedPrefixes } from "../entries/XpDisallowedPrefixes";
import { XpInThreads } from "../entries/XpInThreads";
import { XpMessage } from "../entries/XpMessage";
import { XpMultipliers } from "../entries/XpMultipliers";
import { XpResponseType } from "../entries/XpResponseType";
import { XpRoleRewards } from "../entries/XpRoleRewards";

interface LevelingProps {
	channels: Channel[];
	openMenu(): void;
	roles: Role[];
	settings: GuildSettings;
}

export default function Leveling({ channels, settings, roles, openMenu }: LevelingProps) {
	const { addChange, data } = useContext(GuildContext);

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	return (
		<>
			<Header
				description="Allow users to gain xp and level up by sending messages."
				extras={
					<button
						className="flex h-fit items-center justify-center rounded-lg bg-[#3ba55d] py-1 px-3 text-center text-white duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-75 disabled:hover:bg-gray-500"
						disabled={!(data?.levels ?? settings.levels)}
						onClick={() => void window.open(`/levels/${settings.id}`, "_blank")}
						type="button"
					>
						Go to Leaderboard
					</button>
				}
				id="levels"
				initialValue={settings.levels}
				onChange={(state) => addChange("levels", state)}
				openMenu={openMenu}
				title="Leveling"
			/>

			<Fieldset>
				<XpResponseType addChange={addChange} channels={channels} settings={settings} />

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
