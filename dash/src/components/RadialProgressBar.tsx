const radius = 35;
const circumference = 2 * Math.PI * radius;
const strokeWidth = 3;

export function RadialProgressBar({ color, percentage, num }: RadialProgressBarProps) {
	const progress = percentage === 0 ? 0 : circumference * (1 - percentage / 100);

	return (
		<div className="relative inline-block">
			<svg className="size-12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" fill="none" r={radius} stroke="#ffffff" strokeWidth={strokeWidth} />
				<circle
					cx="50"
					cy="50"
					fill="none"
					r={radius}
					stroke={color ?? "url(#percentual-gradient)"}
					strokeDasharray={circumference}
					strokeDashoffset={progress}
					strokeWidth={strokeWidth}
					transform="rotate(-90 50 50)"
				/>
				<text className="text-3xl" dominantBaseline="middle" fill="currentColor" textAnchor="middle" x="50%" y="50%">
					{num}
				</text>
			</svg>
		</div>
	);
}

interface RadialProgressBarProps {
	readonly percentage: number;
	readonly color: string | null;
	readonly num: number;
}
