import { GithubInfo } from "fumadocs-ui/components/github-info";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import logoSmall from "@/assets/logo-small.webp";
import { GITHUB_REPOSITORY_NAME, GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY_URL } from "@/shared-links.ts";

export function baseOptions(): BaseLayoutProps {
	return {
		githubUrl: GITHUB_REPOSITORY_URL,
		links: [
			{
				text: "Open Dashboard",
				url: "/../",
			},
			{
				children: <GithubInfo owner={GITHUB_REPOSITORY_OWNER} repo={GITHUB_REPOSITORY_NAME} />,
				type: "custom",
			},
		],
		nav: {
			title: (
				<>
					<Image
						alt="Lurkr"
						aria-label="Lurkr"
						className="size-5"
						height={20}
						sizes="20px"
						src={logoSmall}
						width={20}
					/>
					<span className="font-medium">Lurkr Docs</span>
				</>
			),
		},
		themeSwitch: {
			enabled: false,
		},
	};
}
