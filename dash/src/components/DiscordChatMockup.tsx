import Image from "next/image";
import almeidaAvatar from "@/assets/almeida-avatar.webp";
import levelCard from "@/assets/level-card.webp";
import logoSmall from "@/assets/logo-small.webp";

export function DiscordChatMockup() {
	return (
		<div
			className="relative w-full overflow-hidden rounded-2xl"
			style={{
				background: "#313338",
				boxShadow: "0 32px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)",
				maxWidth: 430,
			}}
		>
			{/* Subtle inner glow at top */}
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-32"
				style={{
					background: "radial-gradient(ellipse at 50% -20%, rgba(255,112,119,0.14) 0%, transparent 70%)",
				}}
			/>

			{/* Title bar */}
			<div
				className="relative flex items-center px-4 py-3"
				style={{ background: "#2b2d31", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
			>
				{/* Traffic lights */}
				<div className="flex items-center gap-1.5">
					<div className="size-3 rounded-full" style={{ background: "#ff5f57" }} />
					<div className="size-3 rounded-full" style={{ background: "#febc2e" }} />
					<div className="size-3 rounded-full" style={{ background: "#28c840" }} />
				</div>
				{/* Channel name — absolutely centered over the full bar */}
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1 text-xs">
					<span style={{ color: "#80848e" }}>#</span>
					<span className="font-medium" style={{ color: "#dbdee1" }}>
						general
					</span>
				</div>
			</div>

			{/* Messages area */}
			<div className="flex flex-col gap-0 px-4 py-4" style={{ minHeight: 300 }}>
				{/* Typing indicator — appears first, fades before user message */}
				<div
					className="flex items-center gap-2 overflow-hidden px-2 pb-1"
					style={{
						animation: "dc-typing-fade 1s ease-in-out forwards",
						maxHeight: "2rem",
						opacity: 0,
					}}
				>
					<span className="text-[11px]" style={{ color: "#80848e" }}>
						<span className="font-semibold" style={{ color: "#dbdee1" }}>
							Almeida
						</span>{" "}
						is typing
					</span>
					<span aria-hidden className="inline-flex items-end gap-0.5">
						{[0, 0.2, 0.4].map((delay) => (
							<span
								className="block size-1 rounded-full"
								key={delay}
								style={{
									animation: "dc-dot 1.2s ease-in-out infinite",
									animationDelay: `${delay}s`,
									background: "#80848e",
								}}
							/>
						))}
					</span>
				</div>

				{/* User message */}
				<div
					className="flex gap-3 rounded-md px-2 py-2"
					style={{
						animation: "dc-msg-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
						animationDelay: "1.1s",
						opacity: 0,
					}}
				>
					<div className="mt-0.5 size-10 shrink-0 overflow-hidden rounded-full">
						<Image alt="Almeida" className="no-drag" height={40} src={almeidaAvatar} width={40} />
					</div>
					<div>
						<div className="flex items-baseline gap-2">
							<span className="font-semibold text-sm" style={{ color: "#ff7077" }}>
								Almeida
							</span>
							<span className="text-[11px]" style={{ color: "#80848e" }}>
								Today at 3:42 PM
							</span>
						</div>
						<p className="mt-0.5 text-sm" style={{ color: "#dbdee1" }}>
							gg everyone 🔥
						</p>
					</div>
				</div>

				{/* Lurkr bot message */}
				<div
					className="flex gap-3 rounded-md px-2 py-2"
					style={{
						animation: "dc-msg-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
						animationDelay: "1.9s",
						opacity: 0,
					}}
				>
					{/* Avatar — same bg as chat so no visible ring */}
					<div className="mt-0.5 size-10 shrink-0 overflow-hidden rounded-full" style={{ background: "#313338" }}>
						<Image alt="Lurkr" className="no-drag" height={40} src={logoSmall} width={40} />
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-sm text-white">Lurkr</span>
							<span className="rounded px-1.5 py-px font-bold text-[10px] text-white" style={{ background: "#5865f2" }}>
								✓ APP
							</span>
							<span className="text-[11px]" style={{ color: "#80848e" }}>
								Today at 3:42 PM
							</span>
						</div>

						{/* Embed */}
						<div
							className="mt-2 flex overflow-hidden rounded"
							style={{
								animation: "dc-msg-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
								animationDelay: "2.4s",
								background: "#2b2d31",
								opacity: 0,
							}}
						>
							{/* Accent bar */}
							<div className="w-1 shrink-0" style={{ background: "#ff7077" }} />

							<div className="flex-1 p-3">
								<p className="font-semibold text-sm text-white">⬆️ Level Up!</p>
								<p className="mt-1.5 text-sm leading-snug" style={{ color: "#dbdee1" }}>
									<span
										className="rounded px-1 font-medium text-[12px]"
										style={{ background: "rgba(88,101,242,0.3)", color: "#8ab4f8" }}
									>
										@Almeida
									</span>{" "}
									reached <span className="font-bold text-white">Level 25</span> and gained the{" "}
									<span
										className="rounded px-1 font-medium text-[12px]"
										style={{ background: "rgba(255,112,119,0.2)", color: "#ff7077" }}
									>
										@Gold Member
									</span>{" "}
									role!
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* ── Slash command interaction indicator ── */}
				<div
					className="flex items-center gap-1.5 py-0.5 pl-2"
					style={{
						animation: "dc-msg-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
						animationDelay: "3.5s",
						opacity: 0,
					}}
				>
					{/* L-shaped reply connector */}
					<div
						className="mb-0.5 h-3.5 w-5 shrink-0 self-end rounded-tl"
						style={{ borderLeft: "2px solid rgba(79,84,92,0.6)", borderTop: "2px solid rgba(79,84,92,0.6)" }}
					/>
					{/* Small avatar */}
					<div className="size-4 shrink-0 overflow-hidden rounded-full">
						<Image alt="Almeida" className="no-drag" height={16} src={almeidaAvatar} width={16} />
					</div>
					{/* Text + command badge */}
					<p className="flex items-center gap-1 text-[11px]" style={{ color: "#80848e" }}>
						<span className="font-medium" style={{ color: "#dbdee1" }}>
							Almeida
						</span>
						<span>used</span>
						<span
							className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-[10px] text-white"
							style={{ background: "rgba(88,101,242,0.9)" }}
						>
							<Image alt="" aria-hidden className="no-drag size-3 rounded-sm" height={12} src={logoSmall} width={12} />
							/rank
						</span>
					</p>
				</div>

				{/* ── Lurkr /rank response: thinking → rank card ── */}
				<div
					className="flex gap-3 rounded-md px-2 py-2"
					style={{
						animation: "dc-msg-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
						animationDelay: "4.2s",
						opacity: 0,
					}}
				>
					<div className="mt-0.5 size-10 shrink-0 overflow-hidden rounded-full" style={{ background: "#313338" }}>
						<Image alt="Lurkr" className="no-drag" height={40} src={logoSmall} width={40} />
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-sm text-white">Lurkr</span>
							<span className="rounded px-1.5 py-px font-bold text-[10px] text-white" style={{ background: "#5865f2" }}>
								✓ APP
							</span>
							<span className="text-[11px]" style={{ color: "#80848e" }}>
								Today at 3:43 PM
							</span>
						</div>

						{/* Thinking state — holds then collapses */}
						<div
							className="mt-1.5 flex items-center gap-1.5 overflow-hidden"
							style={{
								animation: "dc-thinking 1.6s ease-in-out forwards",
								animationDelay: "4.7s",
							}}
						>
							<span className="text-sm italic" style={{ color: "#80848e" }}>
								Lurkr is thinking
							</span>
							<span aria-hidden className="inline-flex items-end gap-0.5">
								{[0, 0.2, 0.4].map((delay) => (
									<span
										className="block size-1 rounded-full"
										key={delay}
										style={{
											animation: "dc-dot 1.2s ease-in-out infinite",
											animationDelay: `${delay}s`,
											background: "#80848e",
										}}
									/>
								))}
							</span>
						</div>

						{/* Rank card — expands in as thinking collapses */}
						<div
							className="mt-1 overflow-hidden rounded-lg"
							style={{
								animation: "dc-rank-in 0.55s cubic-bezier(0.16,1,0.3,1) forwards",
								animationDelay: "5.6s",
								maxHeight: 0,
								opacity: 0,
							}}
						>
							<Image
								alt="Lurkr rank card"
								className="no-drag w-full rounded-lg"
								src={levelCard}
								style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)", height: "auto" }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
