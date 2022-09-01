import Image from "next/image";
import Link from "next/link";
import { guildIconCdn } from "../utils/cdn";
import type { Snowflake } from "../utils/constants";
import { FALLBACK_AVATAR_PATH } from "../utils/constants";

interface GuildProps {
	baseRedirectPath: string;
	icon: string | null;
	id: Snowflake;
	name: string;
}

export default function Guild({ baseRedirectPath, icon, id, name }: GuildProps) {
	return (
		<Link href={`${baseRedirectPath}${id}`} key={id}>
			<a className="relative flex h-44 w-40 flex-col flex-wrap gap-2 rounded-2xl bg-discord-slightly-darker py-4 px-6 text-center shadow-sm">
				{icon ? (
					<img
						alt={`${name} server icon`}
						className="rounded-lg"
						height={128}
						src={guildIconCdn(id, icon, 128)}
						width={128}
					/>
				) : (
					<Image className="rounded-lg" height={128} src={FALLBACK_AVATAR_PATH} width={128} />
				)}

				<span className="absolute bottom-4 left-0 mx-2 w-[calc(100%-1rem)] truncate text-white">{name}</span>
			</a>
		</Link>
	);
}
