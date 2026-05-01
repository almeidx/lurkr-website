interface RankCardMockProps {
	readonly username?: string;
	readonly discriminator?: string;
	readonly level?: number;
	readonly rank?: number;
	readonly xp?: number;
	readonly xpNext?: number;
	readonly accent?: string;
	readonly avatarBg?: string;
	readonly bg?: "default" | "sunset" | "midnight";
}

const BACKGROUNDS: Record<NonNullable<RankCardMockProps["bg"]>, string> = {
	default: "linear-gradient(135deg, #1e1f22 0%, #232529 100%)",
	midnight: "linear-gradient(135deg, #0e1a2b 0%, #1a1632 100%)",
	sunset: "linear-gradient(135deg, #2a1419 0%, #3a2418 50%, #1a1210 100%)",
};

export function RankCardMock({
	username = "almeidx",
	discriminator = "0001",
	level = 42,
	rank = 3,
	xp = 18_420,
	xpNext = 24_000,
	accent = "#ff7077",
	avatarBg = "linear-gradient(135deg, #5865f2, #ff7077)",
	bg = "default",
}: RankCardMockProps) {
	const pct = Math.min(100, (xp / xpNext) * 100);

	return (
		<div
			className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-white/5 p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
			style={{ background: BACKGROUNDS[bg] }}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background: `radial-gradient(circle at 90% 10%, ${accent}22 0%, transparent 50%)`,
				}}
			/>

			<div
				className="relative z-1 flex size-20 shrink-0 items-center justify-center rounded-full font-extrabold text-[32px] text-white"
				style={{ background: avatarBg, border: `3px solid ${accent}` }}
			>
				{username[0]!.toUpperCase()}
			</div>

			<div className="relative z-1 min-w-0 flex-1">
				<div className="mb-2.5 flex items-baseline justify-between gap-2">
					<div className="min-w-0">
						<span className="font-bold text-[18px] text-white tracking-[-0.2px]">{username}</span>
						<span className="ml-0.5 font-normal text-[14px] text-white/45">#{discriminator}</span>
					</div>
					<div className="flex items-baseline gap-3.5">
						<div>
							<span className="font-semibold text-[10px] text-white/45 uppercase tracking-[0.5px]">Rank</span>{" "}
							<span className="font-extrabold text-[18px] text-white">#{rank}</span>
						</div>
						<div>
							<span className="font-semibold text-[10px] text-white/45 uppercase tracking-[0.5px]">Level</span>{" "}
							<span
								className="bg-clip-text font-extrabold text-[22px] text-transparent"
								style={{
									backgroundImage: `linear-gradient(92deg, ${accent}, #ffe87c)`,
								}}
							>
								{level}
							</span>
						</div>
					</div>
				</div>

				<div className="relative h-2.5 overflow-hidden rounded-full bg-white/6">
					<div
						className="h-full rounded-full"
						style={{
							background: `linear-gradient(90deg, ${accent}, #ffe87c)`,
							boxShadow: `0 0 12px ${accent}66`,
							width: `${pct}%`,
						}}
					/>
				</div>
				<div className="mt-1.5 flex justify-between text-[11px] text-white/45 tabular-nums">
					<span>{xp.toLocaleString()} XP</span>
					<span>{xpNext.toLocaleString()} XP</span>
				</div>
			</div>
		</div>
	);
}
