import { FaGlobe, FaUserFriends } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import RoleChannelBullet from "~/components/RoleChannelBullet";
import { XpMultiplierType, type Channel, type IMultiplier, type Role } from "~/contexts/GuildContext";
import { resolveColour } from "~/utils/common";

export default function Multiplier({ items, multiplier, targets, type }: MultiplierProps) {
	const Icon =
		type === XpMultiplierType.Channel ? IoMdChatbubbles : type === XpMultiplierType.Role ? FaUserFriends : FaGlobe;

	return (
		<div className="my-2 mx-4 flex flex-col gap-2">
			<span className="flex flex-row items-center gap-2 text-center text-white">
				<Icon />
				{type[0]!.toUpperCase() + type.slice(1)} - x{multiplier}
			</span>

			{type !== XpMultiplierType.Global && targets && items && (
				<div className="flex shrink-0 flex-row flex-wrap gap-1.5">
					{type === XpMultiplierType.Channel
						? targets.map((id) => {
								const item = (items as Channel[]).find((item) => item.id === id);
								if (!item) {
									return null;
								}

								return <RoleChannelBullet channelType={item.type} key={id} name={item.name} type={type} />;
						  })
						: targets.map((id) => {
								const item = (items as Role[]).find((item) => item.id === id);
								if (!item) {
									return null;
								}

								return (
									<RoleChannelBullet key={id} name={item.name} roleColour={resolveColour(item.color)} type={type} />
								);
						  })}
				</div>
			)}
		</div>
	);
}

type MultiplierProps = Omit<IMultiplier, "id"> & {
	items: Channel[] | Role[] | null;
};
