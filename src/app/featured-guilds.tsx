"use client";

import "swiper/css";

import discoverableSvg from "@/assets/guild-badges/discoverable.svg";
import partnerSvg from "@/assets/guild-badges/partner.svg";
import verifiedSvg from "@/assets/guild-badges/verified.svg";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { type Snowflake, guildIcon } from "@/utils/discord-cdn.ts";
import { formatToNearestOrderOfMagnitude } from "@/utils/format-to-nearest-order-of-magnitude.ts";
import Image from "next/image";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export function FeaturedGuilds({ guilds }: FeaturedGuildsProps) {
	return (
		<div className="relative">
			<Swiper
				spaceBetween={20}
				slidesPerView={4}
				breakpoints={{
					0: { slidesPerView: 1 },
					640: { slidesPerView: 1 },
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
					1280: { slidesPerView: 3 },
					1536: { slidesPerView: 4 },
				}}
				loop
				autoplay={{ delay: 2_000 }}
				freeMode={{ enabled: true }}
				modules={[Autoplay, FreeMode]}
			>
				{guilds.map((guild) => (
					<SwiperSlide className="mr-5 max-w-96" key={guild.id}>
						<FeaturedGuild key={guild.id} {...guild} />
					</SwiperSlide>
				))}
			</Swiper>

			<div className="absolute inset-y-0 right-[90%] left-0 z-10 bg-gradient-to-l from-transparent to-background" />
			<div className="absolute inset-y-0 right-0 left-[90%] z-10 bg-gradient-to-r from-transparent to-background" />
		</div>
	);
}

function FeaturedGuild({ id, icon, name, memberCount, partner, verified }: FeaturedGuild) {
	const iconSrc = verified ? verifiedSvg : partner ? partnerSvg : discoverableSvg;
	const alt = verified ? "Verified guild badge" : partner ? "Partner guild badge" : "Discoverable guild badge";

	return (
		<div className="flex select-none items-center gap-4 rounded-lg border border-white/25 bg-darker px-3 py-2 md:gap-6">
			<ImageWithFallback
				alt={`${name}'s icon`}
				className="no-drag size-14 rounded-full md:size-16"
				height={64}
				src={guildIcon(id, icon, { format: "webp", size: 64 })}
				priority
				width={64}
			/>

			<div className="flex flex-col">
				<p
					className="flex max-w-[70%] items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-lg sm:max-w-[16rem] sm:text-xl md:max-w-64 lg:text-2xl"
					title={name}
				>
					<Image src={iconSrc} alt={alt} width={20} height={20} className="no-drag size-5 rounded-full" />
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
}

export interface FeaturedGuild {
	id: Snowflake;
	name: string;
	icon: string | null;
	memberCount: number;
	verified: boolean;
	partner: boolean;
}
