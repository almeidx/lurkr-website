"use client";

import { cva } from "class-variance-authority";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, ChevronDown, Copy, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/cn.ts";
import { AnthropicIcon } from "./brand-icons/anthropic-icon.tsx";
import { GitHubIcon } from "./brand-icons/github-icon.tsx";
import { OpenAIIcon } from "./brand-icons/openai-icon.tsx";
import { buttonVariants } from "./ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx";

const cache = new Map<string, string>();

export function LLMCopyButton({
	/**
	 * A URL to fetch the raw Markdown/MDX content of page
	 */
	markdownUrl,
}: {
	markdownUrl: string;
}) {
	const [isLoading, setLoading] = useState(false);
	const [checked, onClick] = useCopyButton(async () => {
		const cached = cache.get(markdownUrl);
		if (cached) return navigator.clipboard.writeText(cached);

		setLoading(true);

		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					"text/plain": fetch(markdownUrl).then(async (res) => {
						const content = await res.text();
						cache.set(markdownUrl, content);

						return content;
					}),
				}),
			]);
		} catch (error) {
			setLoading(false);
			throw error;
		}

		setLoading(false);
	});

	return (
		<button
			className={cn(
				buttonVariants({
					className: "gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground",
					color: "secondary",
					size: "sm",
				}),
			)}
			disabled={isLoading}
			onClick={onClick}
			type="button"
		>
			{checked ? <Check /> : <Copy />}
			Copy Markdown
		</button>
	);
}

const optionVariants = cva(
	"text-sm p-2 rounded-lg inline-flex items-center gap-2 hover:text-fd-accent-foreground hover:bg-fd-accent [&_svg]:size-4",
);

export function ViewOptions({
	markdownUrl,
	githubUrl,
}: {
	/**
	 * A URL to the raw Markdown/MDX content of page
	 */
	markdownUrl: string;

	/**
	 * Source file URL on GitHub
	 */
	githubUrl: string;
}) {
	const fullMarkdownUrl =
		typeof window === "undefined" ? markdownUrl : new URL(markdownUrl, window.location.origin).toString();
	const q = `Read ${fullMarkdownUrl}, I want to ask questions about it.`;

	const items = [
		{
			href: githubUrl,
			icon: <GitHubIcon />,
			title: "Open in GitHub",
		},
		{
			href: `https://chatgpt.com/?${new URLSearchParams({
				hints: "search",
				q,
			})}`,
			icon: <OpenAIIcon />,
			title: "Open in ChatGPT",
		},
		{
			href: `https://claude.ai/new?${new URLSearchParams({
				q,
			})}`,
			icon: <AnthropicIcon />,
			title: "Open in Claude",
		},
		// {
		// 	href: `https://cursor.com/link/prompt?${new URLSearchParams({
		// 		text: q,
		// 	})}`,
		// 	icon: (
		// 		<svg fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		// 			<title>Cursor</title>
		// 			<path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
		// 		</svg>
		// 	),
		// 	title: "Open in Cursor",
		// },
	];

	return (
		<Popover>
			<PopoverTrigger
				className={cn(
					buttonVariants({
						className: "gap-2",
						color: "secondary",
						size: "sm",
					}),
				)}
			>
				Open
				<ChevronDown className="size-3.5 text-fd-muted-foreground" />
			</PopoverTrigger>
			<PopoverContent className="flex flex-col">
				{items.map((item) => (
					<a
						className={cn(optionVariants())}
						href={item.href}
						key={item.href}
						rel="noreferrer noopener"
						target="_blank"
					>
						{item.icon}
						{item.title}
						<ExternalLinkIcon className="ms-auto size-3.5 text-fd-muted-foreground" />
					</a>
				))}
			</PopoverContent>
		</Popover>
	);
}
