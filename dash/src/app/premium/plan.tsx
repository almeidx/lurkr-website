import { ChartLine, Check, Xmark } from "@gravity-ui/icons";
import { Card, Chip, Link as HeroLink } from "@heroui/react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
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

	const buttonGradient =
		tier === 1
			? "bg-gradient-to-r from-[#aad6c6] via-[#fa9079] to-[#74da9c]"
			: tier === 2
				? "bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe]"
				: "bg-gradient-to-r from-[#ff7077] to-[#ffe87c]";

	const borderGradient =
		tier === 1
			? "bg-gradient-to-br from-[#aad6c6] via-[#fa9079] to-[#74da9c]"
			: tier === 2
				? "bg-gradient-to-br from-[#a2fbec] via-[#f985ff] to-[#4d54fe]"
				: "";

	return (
		<div className={`relative flex-1 ${isPopular ? "md:-mt-4 md:mb-4" : ""}`}>
			{/* Gradient glow behind card */}
			{tier !== 0 && <div className={`absolute -inset-1 -z-10 rounded-3xl opacity-50 blur-md ${borderGradient}`} />}

			{/* Gradient border wrapper */}
			{tier !== 0 ? (
				<div className={`overflow-hidden rounded-2xl p-0.5 ${borderGradient}`}>
					<Card className="h-full rounded-[14px]">
						<CardContent
							buttonGradient={buttonGradient}
							buttonText={buttonText}
							funny={funny}
							href={href}
							img={img}
							isCurrent={isCurrent}
							isExternal={isExternal}
							isPopular={isPopular}
							name={name}
							perks={perks}
							price={price}
							regular={regular}
						/>
					</Card>
				</div>
			) : (
				<Card className="h-full border border-white/20">
					<CardContent
						buttonGradient={buttonGradient}
						buttonText={buttonText}
						funny={funny}
						href={href}
						img={img}
						isCurrent={isCurrent}
						isExternal={isExternal}
						isPopular={isPopular}
						name={name}
						perks={perks}
						price={price}
						regular={regular}
					/>
				</Card>
			)}
		</div>
	);
}

function CardContent({
	isPopular,
	isCurrent,
	img,
	name,
	price,
	perks,
	regular,
	funny,
	isExternal,
	href,
	buttonGradient,
	buttonText,
}: CardContentProps) {
	return (
		<>
			<Card.Header className="relative flex-col items-center gap-3 pt-6">
				{isPopular && (
					<Chip className="absolute -top-3 bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe] font-semibold text-black">
						Increased Limits
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

			<Card.Content className="flex flex-1 flex-col gap-8 px-6">
				<div className="text-center">
					<div className="flex items-baseline justify-center gap-1">
						<span className="font-bold text-5xl tracking-tight">${price}</span>
						<span className="text-lg text-white/60">/month</span>
					</div>
					<p className="mt-1 text-sm text-white/50">{price === 0 ? "Free forever" : "Billed monthly via Patreon"}</p>
				</div>

				<div className="flex-1 space-y-4">
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
								<ChartLine aria-hidden className="size-4 text-[#f6e594]" />
							</div>
							<span className="text-sm text-white/80">{perk}</span>
						</div>
					))}

					<div className="flex items-start gap-3">
						<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10">
							<Xmark aria-hidden className="size-4 text-white/40" />
						</div>
						<span className="text-sm text-white/50">{funny}</span>
					</div>
				</div>
			</Card.Content>

			<Card.Footer className="px-6 pt-4 pb-6">
				{isExternal ? (
					<HeroLink
						className={`${buttonGradient} flex w-full items-center justify-center rounded-xl px-6 py-3 font-bold text-black text-lg transition-opacity hover:opacity-90 ${isCurrent ? "pointer-events-none opacity-50" : ""}`}
						href={href}
						rel="external noopener noreferrer"
						target="_blank"
					>
						{buttonText}
					</HeroLink>
				) : (
					<Link
						className={`${buttonGradient} flex w-full items-center justify-center rounded-xl px-6 py-3 font-bold text-black text-lg transition-opacity hover:opacity-90 ${isCurrent ? "pointer-events-none opacity-50" : ""}`}
						href={href}
						prefetch={false}
					>
						{buttonText}
					</Link>
				)}
			</Card.Footer>
		</>
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

interface CardContentProps {
	readonly isPopular?: boolean;
	readonly isCurrent: boolean;
	readonly img: StaticImageData;
	readonly name: string;
	readonly price: number;
	readonly perks: string[];
	readonly regular?: string[];
	readonly funny: string;
	readonly isExternal: boolean;
	readonly href: string;
	readonly buttonGradient: string;
	readonly buttonText: string;
}
