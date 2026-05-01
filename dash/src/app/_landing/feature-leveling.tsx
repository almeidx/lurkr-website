import clsx from "clsx";
import { BulletList, GradientText, SectionHeader } from "./shared.tsx";

interface LeaderboardRow {
	readonly color: string;
	readonly lvl: number;
	readonly rank: number;
	readonly user: string;
	readonly xp: number;
	readonly dim?: boolean;
	readonly highlight?: boolean;
}

const ROWS: readonly LeaderboardRow[] = [
	{ color: "#ffe87c", lvl: 87, rank: 1, user: "mira", xp: 245_000 },
	{ color: "#c0c0c0", lvl: 64, rank: 2, user: "koji", xp: 182_000 },
	{ color: "#cd7f32", lvl: 42, rank: 3, user: "alex", xp: 98_400 },
	{ color: "#5865f2", dim: true, lvl: 38, rank: 4, user: "sam", xp: 82_100 },
	{ color: "#ff7077", highlight: true, lvl: 24, rank: 5, user: "you", xp: 42_800 },
];

export function FeatureLeveling() {
	return (
		<section className="mx-auto w-full max-w-[1400px] px-8 py-24 max-md:px-5 max-md:py-16">
			<div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
				<div>
					<SectionHeader
						desc="XP per message, custom curves, per-channel mode, cooldowns, disallowed prefixes, role & channel multipliers. Configure every dial — or ship the defaults and forget about it."
						kicker="Core engine"
						title={
							<>
								The ultimate <GradientText italic>leveling system.</GradientText>
							</>
						}
					/>
					<BulletList
						items={[
							"Configurable XP curve (linear / exponential / custom)",
							"Per-channel XP mode & thread support",
							"XP-gain interval, range, and commands",
							"Leaderboard with vanity URL & privacy controls",
						]}
					/>
				</div>
				<LeaderboardMock />
			</div>
		</section>
	);
}

function LeaderboardMock() {
	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-linear-to-br from-[#1e1f22] to-[#232529] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] max-md:p-5">
			{ROWS.map((row) => (
				<div
					className={clsx(
						"flex items-center gap-3.5 rounded-xl border px-4 py-2.5",
						row.highlight ? "border-primary/30 bg-primary/10" : "border-white/5 bg-white/2",
						row.dim && "opacity-60",
					)}
					key={row.rank}
				>
					<span
						className="min-w-7 text-center font-extrabold text-[14px]"
						style={{ color: row.rank <= 3 ? row.color : "rgba(255,255,255,0.45)" }}
					>
						#{row.rank}
					</span>
					<div
						className="flex size-8 shrink-0 items-center justify-center rounded-full font-extrabold text-[#1e1f22] text-[13px]"
						style={{ background: `linear-gradient(135deg, ${row.color}, #ffe87c)` }}
					>
						{row.user[0]!.toUpperCase()}
					</div>
					<span className="min-w-0 flex-1 overflow-hidden text-ellipsis font-medium text-[14px] text-white">
						{row.user}
					</span>
					<span className="text-[12px] text-white/70 tabular-nums">{row.xp.toLocaleString()} XP</span>
					<span
						className={clsx(
							"rounded-full px-2.5 py-1 font-bold text-[12px] tracking-[0.3px]",
							row.highlight ? "bg-linear-(--lurkr-gradient) text-[#1e1f22]" : "bg-white/6 text-white",
						)}
					>
						LVL {row.lvl}
					</span>
				</div>
			))}
		</div>
	);
}
