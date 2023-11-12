export function QuestionMark({ href }: QuestionMarkProps) {
	return (
		<a
			className="rounded-full bg-white/75 px-[5px] text-xs text-background transition-colors hover:bg-white/50"
			href={href}
			rel="external noopener noreferrer"
			target="_blank"
		>
			?
		</a>
	);
}

interface QuestionMarkProps {
	readonly href: string;
}
