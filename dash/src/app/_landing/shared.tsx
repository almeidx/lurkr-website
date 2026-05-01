import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { ExternalLink } from "@/components/ExternalLink.tsx";

type GradientCTAProps = PropsWithChildren<{
	readonly href: string;
	readonly external?: boolean;
	readonly className?: string;
}>;

export function GradientCTA({ children, href, external, className }: GradientCTAProps) {
	const classes = clsx(
		"group relative inline-flex items-center gap-2 rounded-xl bg-linear-(--lurkr-gradient) px-7 py-4 font-bold text-[#1e1f22] text-base shadow-[0_8px_24px_-8px_rgba(255,112,119,0.6)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(255,112,119,0.8)]",
		className,
	);

	return external ? (
		<ExternalLink className={classes} href={href}>
			{children}
		</ExternalLink>
	) : (
		<Link className={classes} href={href}>
			{children}
		</Link>
	);
}

type OutlineCTAProps = PropsWithChildren<{
	readonly href: string;
	readonly external?: boolean;
	readonly className?: string;
}>;

export function OutlineCTA({ children, href, external, className }: OutlineCTAProps) {
	const classes = clsx(
		"inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-white text-base transition-all duration-150 hover:border-white/20 hover:bg-white/10",
		className,
	);

	return external ? (
		<ExternalLink className={classes} href={href}>
			{children}
		</ExternalLink>
	) : (
		<Link className={classes} href={href}>
			{children}
		</Link>
	);
}

export function GradientText({
	children,
	italic,
	className,
}: PropsWithChildren<{ italic?: boolean; className?: string }>) {
	return (
		<span className={clsx("bg-linear-(--lurkr-gradient) bg-clip-text text-transparent", italic && "italic", className)}>
			{children}
		</span>
	);
}

interface SectionHeaderProps {
	readonly kicker: string;
	readonly title: ReactNode;
	readonly desc: ReactNode;
	readonly align?: "left" | "center";
	readonly className?: string;
}

export function SectionHeader({ kicker, title, desc, align = "left", className }: SectionHeaderProps) {
	return (
		<div className={clsx(align === "center" ? "mx-auto max-w-180 text-center" : "max-w-150", "mb-12", className)}>
			<p className="m-0 font-bold text-[12px] text-primary uppercase tracking-[2px]">{kicker}</p>
			<h2 className="m-0 mt-2.5 mb-4 font-extrabold text-[clamp(2rem,4vw,3.25rem)] text-white leading-[1.05] tracking-[-0.025em]">
				{title}
			</h2>
			<p className="m-0 text-[17px] text-white/70 leading-[1.55]">{desc}</p>
		</div>
	);
}

export function Kicker({ children, className }: PropsWithChildren<{ className?: string }>) {
	return (
		<p className={clsx("m-0 font-semibold text-[13px] text-white/55 uppercase tracking-[2px]", className)}>
			{children}
		</p>
	);
}

export function BulletList({ items, className, ...rest }: { items: readonly string[] } & ComponentProps<"ul">) {
	return (
		<ul className={clsx("m-0 grid list-none gap-2.5 p-0", className)} {...rest}>
			{items.map((item) => (
				<li className="flex items-center gap-3 text-[15px] text-white/85" key={item}>
					<span
						aria-hidden
						className="flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-(--lurkr-gradient) font-black text-[#1e1f22] text-[11px]"
					>
						✓
					</span>
					{item}
				</li>
			))}
		</ul>
	);
}
