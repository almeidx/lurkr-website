import { ExternalLink } from "@/components/ExternalLink.tsx";

export function QuestionMark({ href }: QuestionMarkProps) {
	return (
		<ExternalLink
			className="rounded-full bg-white/75 px-[5px] text-background text-xs transition-colors hover:bg-white/50"
			href={href}
		>
			<span className="sr-only">Open documentation in a new tab</span>?
		</ExternalLink>
	);
}

interface QuestionMarkProps {
	readonly href: string;
}
