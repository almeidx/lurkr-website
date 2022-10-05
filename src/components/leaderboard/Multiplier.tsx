import { FaGlobe, FaUserFriends } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { XpMultiplierType, type Channel, type IMultiplier, type Role } from "../../contexts/GuildContext";
import { resolveColour } from "../../utils/common";
import RoleChannelBullet from "../RoleChannelBullet";

type MultiplierProps = Omit<IMultiplier, "id"> & {
	items: Channel[] | Role[] | null;
};

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
								const item = items.find((item) => item.id === id) as Channel | undefined;
								if (!item) {
									return null;
								}

								return <RoleChannelBullet key={id} name={item.name} type={type} />;
						  })
						: targets.map((id) => {
								// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
								const item = items.find((item) => item.id === id) as Role | undefined;
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
