import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";

interface AvatarProps {
	readonly color?: string;
	readonly letter?: string;
	readonly size?: number;
}

export function Avatar({ color = "#ff7077", letter = "L", size = 40 }: AvatarProps) {
	return (
		<div
			className="flex shrink-0 items-center justify-center rounded-full font-black text-[#1e1f22] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
			style={{
				background: `linear-gradient(135deg, ${color} 0%, #ffe87c 100%)`,
				fontSize: size * 0.45,
				height: size,
				width: size,
			}}
		>
			{letter}
		</div>
	);
}

export interface Reaction {
	readonly emoji: string;
	readonly count: number;
	readonly mine?: boolean;
}

interface ChatMessageProps {
	readonly avatarColor: string;
	readonly letter: string;
	readonly name: string;
	readonly roleColor?: string;
	readonly time: string;
	readonly reactions?: readonly Reaction[];
	readonly edited?: boolean;
}

export function ChatMessage({
	avatarColor,
	letter,
	name,
	roleColor,
	time,
	children,
	reactions = [],
	edited,
}: PropsWithChildren<ChatMessageProps>) {
	return (
		<div className="flex gap-3.5 rounded-lg px-3 py-1.5">
			<Avatar color={avatarColor} letter={letter} />
			<div className="min-w-0 flex-1">
				<div className="mb-0.5 flex items-baseline gap-2">
					<span className="font-semibold text-[15px]" style={{ color: roleColor || "#fff" }}>
						{name}
					</span>
					<span className="text-[11px] text-white/40">{time}</span>
				</div>
				<div className="break-words text-[14.5px] text-white/85 leading-[1.4]">
					{children}
					{edited ? <span className="ml-1 text-[10px] text-white/40">(edited)</span> : null}
				</div>
				{reactions.length > 0 ? (
					<div className="mt-1.5 flex flex-wrap gap-1">
						{reactions.map((r) => (
							<div
								className={clsx(
									"flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[12px] text-white/85",
									r.mine ? "border-primary/40 bg-primary/15" : "border-white/5 bg-white/5",
								)}
								key={r.emoji}
							>
								<span>{r.emoji}</span>
								<span className="font-medium">{r.count}</span>
							</div>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

interface BotMessageProps {
	readonly username?: string;
	readonly time?: string;
}

export function BotMessage({
	children,
	username = "Lurkr",
	time = "Today at 20:42",
}: PropsWithChildren<BotMessageProps>) {
	return (
		<div className="flex gap-3.5 rounded-lg px-3 py-1.5">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-(--lurkr-gradient) font-black text-[#1e1f22] text-[20px]">
				L
			</div>
			<div className="flex-1">
				<div className="mb-1 flex items-baseline gap-1.5">
					<span className="font-semibold text-[15px] text-white">{username}</span>
					<span className="rounded-[3px] bg-linear-(--lurkr-gradient) px-1.5 py-[1px] font-bold text-[#1e1f22] text-[10px] tracking-[0.3px]">
						APP
					</span>
					<span className="text-[11px] text-white/40">{time}</span>
				</div>
				{children}
			</div>
		</div>
	);
}

interface LevelUpCardProps {
	readonly user: string;
	readonly level: number;
	readonly color?: string;
	readonly message?: ReactNode;
}

export function LevelUpCard({ user, level, color = "#ff7077", message }: LevelUpCardProps) {
	return (
		<div
			className="flex max-w-110 flex-col gap-2 rounded-[4px] bg-[rgba(46,48,54,0.6)] px-4 py-3"
			style={{ borderLeft: `4px solid ${color}` }}
		>
			<div className="font-medium text-[14.5px] text-white">
				{message ?? (
					<>
						🎉 <b style={{ color }}>@{user}</b> just leveled up to <b>Level {level}</b>!
					</>
				)}
			</div>
		</div>
	);
}

interface ChannelHeaderProps {
	readonly name: string;
	readonly topic?: string;
}

export function ChannelHeader({ name, topic }: ChannelHeaderProps) {
	return (
		<div className="flex items-center gap-2.5 border-white/5 border-b bg-[#2b2d31] px-5 py-3.5">
			<span className="font-semibold text-[18px] text-white/40">#</span>
			<span className="font-semibold text-[15px] text-white">{name}</span>
			{topic ? (
				<>
					<span className="mx-2 block h-[18px] w-px bg-white/10" />
					<span className="text-[13px] text-white/55">{topic}</span>
				</>
			) : null}
		</div>
	);
}
