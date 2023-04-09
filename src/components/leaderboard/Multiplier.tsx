import { FaGlobe, FaUserFriends } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import RoleChannelBullet from "~/components/RoleChannelBullet";
import { XpMultiplierType, type Channel, type IMultiplier, type Role } from "~/contexts/GuildContext";
import { resolveColour } from "~/utils/common";

export default function Multiplier({ multiplier, targets, type }: MultiplierProps) {
	const Icon =
		type === XpMultiplierType.Channel ? IoMdChatbubbles : type === XpMultiplierType.Role ? FaUserFriends : FaGlobe;

	return (
		<div className="mx-4 my-2 flex flex-col gap-2">
			<span className="flex flex-row items-center gap-2 text-center text-white">
				<Icon />
				{type[0]!.toUpperCase() + type.slice(1)} - x{multiplier}
			</span>

			{type !== XpMultiplierType.Global && targets && (
				<div className="flex shrink-0 flex-row flex-wrap gap-1.5">
					{type === XpMultiplierType.Channel
						? (targets as Channel[]).map((channel) => (
								<RoleChannelBullet channelType={channel.type} key={channel.id} name={channel.name} type={type} />
						  ))
						: (targets as Role[]).map((role) => (
								<RoleChannelBullet key={role.id} name={role.name} roleColour={resolveColour(role.color)} type={type} />
						  ))}
				</div>
			)}
		</div>
	);
}

type MultiplierProps = Omit<IMultiplier, "id">;
