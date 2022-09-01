import { FaGlobe, FaUserFriends } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { type Multiplier as IMultiplier, MultiplierType } from "../../graphql/queries/DashboardGuild";
import type { Channel, Role } from "../../graphql/queries/GuildLevels";
import { resolveColour } from "../../utils/utils";
import RoleChannelBullet from "../RoleChannelBullet";

type MultiplierProps = Omit<IMultiplier, "id"> & {
	items: Channel[] | Role[] | null;
};

export default function Multiplier({ items, multiplier, targets, type }: MultiplierProps) {
	const Icon =
		type === MultiplierType.Channel ? IoMdChatbubbles : type === MultiplierType.Role ? FaUserFriends : FaGlobe;

	return (
		<div className="my-2 mx-4 flex flex-col gap-2">
			<span className="flex flex-row items-center gap-2 text-center text-white">
				<Icon />
				{type[0].toUpperCase() + type.slice(1)} - x{multiplier}
			</span>

			{type !== MultiplierType.Global && targets && items && (
				<div className="flex shrink-0 flex-row flex-wrap gap-1.5">
					{type === MultiplierType.Channel
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
									<RoleChannelBullet key={id} name={item.name} type={type} roleColour={resolveColour(item.color)} />
								);
						  })}
				</div>
			)}
		</div>
	);
}
