import type { RoleReward } from "../../contexts/GuildContext";
import { resolveColour } from "../../utils/common";
import RoleChannelBullet from "../RoleChannelBullet";

export default function Role({ level, roles }: RoleReward) {
	return (
		<div className="my-2 mx-4 flex flex-col gap-2" key={level}>
			<span className="text-white">Level {level}</span>
			<div className="flex shrink-0 flex-row flex-wrap gap-1.5">
				{roles.map(({ color, id, name }) => (
					<RoleChannelBullet type="Role" key={id} roleColour={resolveColour(color)} name={name} />
				))}
			</div>
		</div>
	);
}
