import Image from "next/image";
import Link from "next/link";
import { guildIconCdn } from "~/utils/cdn";
import { FALLBACK_AVATAR, type Snowflake } from "~/utils/constants";

export default function Guild({ baseRedirectPath, icon, id, name }: GuildProps) {
	return (
		<Link
			className="relative flex h-44 w-40 flex-col flex-wrap gap-2 rounded-2xl bg-discord-slightly-darker px-6 py-4 text-center shadow-sm"
			href={`${baseRedirectPath}/${id}`}
			key={id}
			prefetch={false}
		>
			<Image
				alt={`${name} guild icon`}
				className="rounded-lg"
				height={128}
				src={icon ? guildIconCdn(id, icon, 128) : FALLBACK_AVATAR}
				// Only optimize if the image is the fallback avatar
				unoptimized={Boolean(icon)}
				width={128}
			/>
			<span className="absolute bottom-4 left-0 mx-2 w-[calc(100%-1rem)] truncate text-white">{name}</span>
		</Link>
	);
}

interface GuildProps {
	readonly baseRedirectPath: "/guilds" | "/levels";
	readonly icon: string | null;
	readonly id: Snowflake;
	readonly name: string;
}
