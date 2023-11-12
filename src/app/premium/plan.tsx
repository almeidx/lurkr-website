import { ExternalLink } from "@/components/ExternalLink.tsx";
import { BiCheck } from "@react-icons/all-files/bi/BiCheck";
import { BsSlashLg } from "@react-icons/all-files/bs/BsSlashLg";
import { ImCross } from "@react-icons/all-files/im/ImCross";
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
				"relative flex-1 flex flex-col px-8 py-9 bg-dark-gray rounded-xl mb-8 h-fit",
				tier !== 0 && "before:absolute before:-inset-px before:blur-sm before:z-[-1]",
				tier === 1
					? "before:bg-gradient-lurkr-max"
					: tier === 2
						? "before:bg-gradient-lurkr-ultimate"
						: "border border-white/25",
				isCurrent &&
					"after:absolute after:-top-4 after:left-1/2 after:-translate-x-1/2 after:rounded-lg after:content-['Current'] after:bg-white after:text-black after:text-xl after:font-bold after:px-4 after:py-1",
			)}
		>
			<h2 className="text-2xl md:text-4xl font-bold text-center text-shadow-regular">{name}</h2>

			<Image
				alt={`${name} premium plan promotional image`}
				src={img}
				width={200}
				height={200}
				className="size-36 md:size-48 self-center mt-2"
				priority
			/>

			<p className="text-center text-4xl md:text-6xl font-bold">
				${price}
				<span className="text-2xl md:text-4xl">/mo</span>
			</p>

			<p className="mt-2 text-center text-white/75">{price === 0 ? "Billed never!" : "Billed recurringly"}</p>

			<div className="mt-4 space-y-3 text-sm md:text-base tracking-tighter text-white/75 whitespace-normal xl:whitespace-nowrap">
				<ul className="space-y-3">
					{perks.map((perk) => (
						<li key={perk} className="flex gap-2 items-center">
							<div className="bg-darker rounded-lg size-9 flex items-center justify-center">
								<BiCheck color="#93e19c" size={35} />
							</div>

							{perk}
						</li>
					))}
				</ul>

				{regular && (
					<ul className="space-y-3">
						{regular.map((perk) => (
							<li key={perk} className="flex gap-2 items-center">
								<div className="bg-darker rounded-lg size-9 flex items-center justify-center">
									<BsSlashLg color="#f6e594" size={19} strokeWidth={2} />
								</div>

								{perk}
							</li>
						))}
					</ul>
				)}

				<div className="flex gap-2 items-center">
					<div className="bg-darker rounded-lg size-9 flex items-center justify-center">
						<ImCross color="#b1b1b2" size={19} />
					</div>

					<p>{funny}</p>
				</div>
			</div>

			<DynamicLink
				className={clsx(
					"mt-4 self-center relative z-[1] text-black w-fit text-center px-6 py-2 text-xl font-bold rounded-lg before:absolute before:inset-0 before:bg-gradient-radial-hover before:z-[-1] before:transition-opacity before:duration-300 before:opacity-0 before:rounded-lg hover:before:opacity-100",
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
