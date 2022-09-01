import type { GuildLevelsRoleInfo } from "../../graphql/queries/GuildLevels";
import { resolveColour } from "../../utils/utils";
import RoleChannelBullet from "../RoleChannelBullet";

interface RoleProps {
	level: number;
	roles: GuildLevelsRoleInfo[];
}

export default function Role({ level, roles }: RoleProps) {
	return (
		<div className="my-2 mx-4 flex flex-col gap-2" key={level}>
			<span className="text-white">Level {level}</span>
			<div className="flex shrink-0 flex-row flex-wrap gap-1.5">
				{roles.map(({ color, id, name }) => (
					<RoleChannelBullet type="role" key={id} roleColour={resolveColour(color)} name={name} />
				))}
			</div>
		</div>
	);
}
