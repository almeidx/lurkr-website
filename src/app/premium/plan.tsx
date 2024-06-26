import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Check, Close, ShowChart } from "@mui/icons-material";
import clsx from "clsx";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { PATREON_URL } from "../../../shared-links.mjs";

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
	return (
		<div
			className={clsx(
				"relative mb-8 flex h-fit flex-1 flex-col rounded-xl bg-dark-gray px-8 py-9",
				tier !== 0 && "before:-inset-px before:absolute before:z-[-1] before:blur-sm",
				tier === 1
					? "before:bg-gradient-lurkr-max"
					: tier === 2
						? "before:bg-gradient-lurkr-ultimate"
						: "border border-white/25",
				isCurrent &&
					"after:-top-4 after:-translate-x-1/2 after:absolute after:left-1/2 after:rounded-lg after:bg-white after:px-4 after:py-1 after:font-bold after:text-black after:text-xl after:content-['Current']",
			)}
		>
			<h2 className="text-center font-bold text-2xl text-shadow-regular md:text-4xl">{name}</h2>

			<Image
				alt={`${name} premium plan promotional image`}
				src={img}
				width={200}
				height={200}
				className="mt-2 size-36 self-center md:size-48"
				priority
			/>

			<p className="text-center font-bold text-4xl md:text-6xl">
				${price}
				<span className="text-2xl md:text-4xl">/mo</span>
			</p>

			<p className="mt-2 text-center text-white/75">{price === 0 ? "Billed never!" : "Billed recurringly"}</p>

			<div className="mt-4 space-y-3 whitespace-normal text-sm text-white/75 tracking-tighter xl:whitespace-nowrap md:text-base">
				<ul className="space-y-3">
					{perks.map((perk) => (
						<li key={perk} className="flex items-center gap-2">
							<div className="flex size-9 items-center justify-center rounded-lg bg-darker">
								<Check className="size-8 text-[#93e19c]" />
							</div>

							{perk}
						</li>
					))}
				</ul>

				{regular && (
					<ul className="space-y-3">
						{regular.map((perk) => (
							<li key={perk} className="flex items-center gap-2">
								<div className="flex size-9 items-center justify-center rounded-lg bg-darker">
									<ShowChart className="size-8 text-[#f6e594]" />
								</div>

								{perk}
							</li>
						))}
					</ul>
				)}

				<div className="flex items-center gap-2">
					<div className="flex size-9 items-center justify-center rounded-lg bg-darker">
						<Close className="size-8 text-[#b1b1b2]" />
					</div>

					<p>{funny}</p>
				</div>
			</div>

			<DynamicLink
				className={clsx(
					"relative z-[1] mt-4 w-fit self-center rounded-lg px-6 py-2 text-center font-bold text-black text-xl before:absolute before:inset-0 before:z-[-1] before:rounded-lg before:bg-gradient-radial-hover before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
					tier === 1 ? "bg-gradient-lurkr-max" : tier === 2 ? "bg-gradient-lurkr-ultimate" : "bg-gradient-radial",
					isCurrent ? "pointer-events-none opacity-50" : "cursor-pointer",
				)}
				href={tier !== 0 ? PATREON_URL : "/guilds"}
			>
				{buttonText}
			</DynamicLink>
		</div>
	);
}

function DynamicLink({ className, href, children, ...props }: ComponentProps<typeof ExternalLink> & { href: string }) {
	if (href.startsWith("http")) {
		return (
			<ExternalLink className={className} href={href} {...props}>
				{children}
			</ExternalLink>
		);
	}

	return (
		<Link className={className} href={href}>
			{children}
		</Link>
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
