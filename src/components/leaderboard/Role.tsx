import RoleChannelBullet from "~/components/RoleChannelBullet";
import type { RoleReward } from "~/contexts/GuildContext";
import { resolveColour } from "~/utils/common";

export default function Role({ level, roles }: RoleReward) {
	return (
		<div className="mx-4 my-2 flex flex-col gap-2" key={level}>
			<span className="text-white">Level {level}</span>
			<div className="flex shrink-0 flex-row flex-wrap gap-1.5">
				{roles.map(({ color, id, name }) => (
					<RoleChannelBullet key={id} name={name} roleColour={resolveColour(color)} type="Role" />
				))}
			</div>
		</div>
	);
}
