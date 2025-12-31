import { Card, Chip, Link as HeroLink } from "@heroui/react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { Check } from "@/components/icons/mdi/check.tsx";
import { Close } from "@/components/icons/mdi/close.tsx";
import { ShowChart } from "@/components/icons/mdi/show-chart.tsx";
import { PATREON_URL } from "@/shared-links.ts";

export function PremiumPlan({
	buttonText,
	funny,
	img,
	name,
	perks,
	price,
	regular,
	tier,
	isCurrent,
	isPopular,
}: PremiumPlanProps) {
	const isExternal = tier !== 0;
	const href = isExternal ? PATREON_URL : "/guilds";

	const gradientBorder =
		tier === 1
			? "before:bg-gradient-to-br before:from-[#aad6c6] before:via-[#fa9079] before:to-[#74da9c]"
			: tier === 2
				? "before:bg-gradient-to-br before:from-[#a2fbec] before:via-[#f985ff] before:to-[#4d54fe]"
				: "";

	const buttonGradient =
		tier === 1
			? "bg-gradient-to-r from-[#aad6c6] via-[#fa9079] to-[#74da9c]"
			: tier === 2
				? "bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe]"
				: "bg-gradient-to-r from-[#ff7077] to-[#ffe87c]";

	return (
		<div className={`relative flex-1 ${isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}>
			{tier !== 0 && (
				<div
					className={`absolute -inset-px -z-10 rounded-3xl opacity-75 blur-sm ${tier === 1 ? "bg-gradient-to-br from-[#aad6c6] via-[#fa9079] to-[#74da9c]" : "bg-gradient-to-br from-[#a2fbec] via-[#f985ff] to-[#4d54fe]"}`}
				/>
			)}
			<Card
				className={`h-full ${tier === 0 ? "border border-white/20" : "border-2 border-transparent"} ${tier !== 0 ? `relative before:absolute before:inset-0 before:rounded-3xl before:p-[2px] ${gradientBorder}` : ""}`}
			>
				<Card.Header className="relative flex-col items-center gap-3 pt-6">
					{isPopular && (
						<Chip className="absolute -top-3 bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe] font-semibold text-black">
							Most Popular
						</Chip>
					)}
					{isCurrent && <Chip className="bg-white font-semibold text-black">Current Plan</Chip>}

					<Image
						alt={`${name} premium plan promotional image`}
						className="size-28 md:size-32"
						height={128}
						priority
						src={img}
						width={128}
					/>

					<Card.Title className="text-center font-bold text-2xl md:text-3xl">{name}</Card.Title>
				</Card.Header>

				<Card.Content className="flex flex-1 flex-col gap-6 px-6">
					<div className="text-center">
						<div className="flex items-baseline justify-center gap-1">
							<span className="font-bold text-5xl tracking-tight">${price}</span>
							<span className="text-lg text-white/60">/month</span>
						</div>
						<p className="mt-1 text-sm text-white/50">{price === 0 ? "Free forever" : "Billed monthly via Patreon"}</p>
					</div>

					<div className="flex-1 space-y-3">
						{perks.map((perk) => (
							<div className="flex items-start gap-3" key={perk}>
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#93e19c]/20">
									<Check aria-hidden className="size-4 text-[#93e19c]" />
								</div>
								<span className="text-sm text-white/80">{perk}</span>
							</div>
						))}

						{regular?.map((perk) => (
							<div className="flex items-start gap-3" key={perk}>
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f6e594]/20">
									<ShowChart aria-hidden className="size-4 text-[#f6e594]" />
								</div>
								<span className="text-sm text-white/80">{perk}</span>
							</div>
						))}

						<div className="flex items-start gap-3">
							<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10">
								<Close aria-hidden className="size-4 text-white/40" />
							</div>
							<span className="text-sm text-white/50">{funny}</span>
						</div>
					</div>
				</Card.Content>

				<Card.Footer className="px-6 pb-6">
					{isExternal ? (
						<HeroLink
							className={`${buttonGradient} flex w-full items-center justify-center rounded-xl px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 ${isCurrent ? "pointer-events-none opacity-50" : ""}`}
							href={href}
							rel="external noopener noreferrer"
							target="_blank"
						>
							{buttonText}
						</HeroLink>
					) : (
						<Link
							className={`${buttonGradient} flex w-full items-center justify-center rounded-xl px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 ${isCurrent ? "pointer-events-none opacity-50" : ""}`}
							href={href}
							prefetch={false}
						>
							{buttonText}
						</Link>
					)}
				</Card.Footer>
			</Card>
		</div>
	);
}

interface PremiumPlanProps {
	readonly name: string;
	readonly img: StaticImageData;
	readonly price: number;
	readonly perks: string[];
	readonly regular?: string[];
	readonly funny: string;
	readonly buttonText: string;
	readonly tier: number;
	readonly isCurrent: boolean;
	readonly isPopular?: boolean;
}
