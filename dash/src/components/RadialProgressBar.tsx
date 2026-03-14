import { ProgressCircle } from "@heroui/react";

export function RadialProgressBar({ color, percentage, num }: RadialProgressBarProps) {
	return (
		<ProgressCircle aria-label={`Level ${num}`} value={percentage}>
			<ProgressCircle.Track className="size-10">
				<ProgressCircle.TrackCircle strokeWidth={1.5} style={{ stroke: "#ffffff" }} />
				<ProgressCircle.FillCircle strokeWidth={1.5} style={{ stroke: color ?? "url(#percentual-gradient)" }} />
				<text dominantBaseline="middle" fill="currentColor" fontSize="14" textAnchor="middle" x="50%" y="50%">
					{num}
				</text>
			</ProgressCircle.Track>
		</ProgressCircle>
	);
}

interface RadialProgressBarProps {
	readonly percentage: number;
	readonly color: string | null;
	readonly num: number;
}
