import Image from "next/image";
import Marquee from "react-fast-marquee";
import discoverableSvg from "@/assets/guild-badges/discoverable.svg";
import partnerSvg from "@/assets/guild-badges/partner.svg";
import verifiedSvg from "@/assets/guild-badges/verified.svg";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { guildIcon, type Snowflake } from "@/utils/discord-cdn.ts";
import { formatToNearestOrderOfMagnitude } from "@/utils/format-to-nearest-order-of-magnitude.ts";

export function FeaturedGuilds({ guilds, direction = "left", speed }: FeaturedGuildsProps) {
	return (
		<div className="relative">
			<Marquee direction={direction} gradient gradientColor="#171717" play speed={speed}>
				{guilds.map((guild, idx) => (
					<FeaturedGuild index={idx} key={guild.id} {...guild} />
				))}
			</Marquee>

			<div className="absolute inset-y-0 right-[90%] left-0 z-10 bg-linear-to-l from-transparent to-background" />
			<div className="absolute inset-y-0 right-0 left-[90%] z-10 bg-linear-to-r from-transparent to-background" />
		</div>
	);
}

function FeaturedGuild({ id, icon, name, memberCount, partner, verified, index }: FeaturedGuild & { index: number }) {
	const iconSrc = verified ? verifiedSvg : partner ? partnerSvg : discoverableSvg;
	const alt = verified ? "Verified guild badge" : partner ? "Partner guild badge" : "Discoverable guild badge";

	return (
		<div className="flex select-none items-center gap-4 rounded-lg border border-white/25 bg-darker px-3 py-2 md:gap-6">
			<ImageWithFallback
				alt={`${name}'s icon`}
				className="no-drag size-14 rounded-full md:size-16"
				height={64}
				priority={index < 4}
				src={guildIcon(id, icon, { format: "webp", size: 64 })}
				width={64}
			/>

			<div className="flex flex-col">
				<p
					className="flex max-w-[70%] items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-lg sm:max-w-64 sm:text-xl md:max-w-64 lg:text-2xl"
					title={name}
				>
					<Image alt={alt} className="no-drag size-5 rounded-full" height={20} src={iconSrc} width={20} />
					{name}
				</p>
				<p className="text-md text-white/50 md:text-lg">
					{formatToNearestOrderOfMagnitude(memberCount).toLocaleString("en")} members
				</p>
			</div>
		</div>
	);
}

interface FeaturedGuildsProps {
	readonly guilds: readonly FeaturedGuild[];
	readonly startDelay?: number;
	readonly speed: number;
	readonly direction?: "left" | "right";
}

export interface FeaturedGuild {
	id: Snowflake;
	name: string;
	icon: string | null;
	memberCount: number;
	verified: boolean;
	partner: boolean;
}
