import { Card, Link as HeroLink } from "@heroui/react";
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
}: PremiumPlanProps) {
	const isExternal = tier !== 0;
	const href = isExternal ? PATREON_URL : "/guilds";

	const buttonClassName =
		tier === 1
			? "bg-linear-(--lurkr-max-gradient) font-bold text-black"
			: tier === 2
				? "bg-linear-(--lurkr-ultimate-gradient) font-bold text-black"
				: "bg-linear-(--lurkr-gradient) font-bold text-black";

	return (
		<Card
			className={
				tier === 1
					? "border-2 border-transparent bg-clip-padding [background:linear-gradient(var(--color-dark-gray),var(--color-dark-gray))_padding-box,linear-gradient(90deg,#aad6c6_1%,#fa9079_33%,#fcc953_66%,#74da9c_100%)_border-box]"
					: tier === 2
						? "border-2 border-transparent bg-clip-padding [background:linear-gradient(var(--color-dark-gray),var(--color-dark-gray))_padding-box,linear-gradient(90deg,#a2fbec_1%,#f985ff_33%,#904dff_66%,#4d54fe_100%)_border-box]"
						: "border border-white/25"
			}
		>
			<Card.Header className="flex-col items-center gap-2 pb-0">
				{isCurrent && <span className="rounded-lg bg-white px-4 py-1 font-bold text-black text-xl">Current</span>}
				<Card.Title className="text-center font-bold text-2xl text-shadow-regular md:text-4xl">{name}</Card.Title>
			</Card.Header>

			<Card.Content className="flex flex-col items-center gap-4">
				<Image
					alt={`${name} premium plan promotional image`}
					className="size-36 md:size-48"
					height={200}
					priority
					src={img}
					width={200}
				/>

				<div className="text-center">
					<p className="font-bold text-4xl md:text-6xl">
						${price}
						<span className="text-2xl md:text-4xl">/mo</span>
					</p>
					<p className="mt-2 text-white/75">{price === 0 ? "Billed never!" : "Billed recurringly"}</p>
				</div>

				<div className="w-full space-y-3 text-sm text-white/75 tracking-tighter md:text-base">
					<ul className="space-y-3">
						{perks.map((perk) => (
							<li className="flex items-center gap-2" key={perk}>
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-darker">
									<Check aria-hidden className="size-8 text-[#93e19c]" />
								</div>
								<span>{perk}</span>
							</li>
						))}
					</ul>

					{regular && (
						<ul className="space-y-3">
							{regular.map((perk) => (
								<li className="flex items-center gap-2" key={perk}>
									<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-darker">
										<ShowChart aria-hidden className="size-8 text-[#f6e594]" />
									</div>
									<span>{perk}</span>
								</li>
							))}
						</ul>
					)}

					<div className="flex items-center gap-2">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-darker">
							<Close aria-hidden className="size-8 text-[#b1b1b2]" />
						</div>
						<span>{funny}</span>
					</div>
				</div>
			</Card.Content>

			<Card.Footer className="justify-center">
				{isExternal ? (
					<HeroLink
						className={`${buttonClassName} inline-flex items-center justify-center rounded-xl px-6 py-3 text-lg ${isCurrent ? "pointer-events-none opacity-50" : ""}`}
						href={href}
						rel="external noopener noreferrer"
						target="_blank"
					>
						{buttonText}
					</HeroLink>
				) : (
					<Link
						className={`${buttonClassName} inline-flex items-center justify-center rounded-xl px-6 py-3 text-lg ${isCurrent ? "pointer-events-none opacity-50" : ""}`}
						href={href}
						prefetch={false}
					>
						{buttonText}
					</Link>
				)}
			</Card.Footer>
		</Card>
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
}
