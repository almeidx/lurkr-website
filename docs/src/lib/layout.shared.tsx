import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import logoSmall from "@/assets/logo-small.webp";
import { GitHubInfoLink } from "@/components/github-info-link.tsx";
import { GITHUB_REPOSITORY_URL } from "@/shared-links.ts";

export function baseOptions(): BaseLayoutProps {
	return {
		githubUrl: GITHUB_REPOSITORY_URL,
		links: [
			{
				text: "Open Dashboard",
				url: "/../",
			},
			{
				children: <GitHubInfoLink />,
				type: "custom",
			},
		],
		nav: {
			title: (
				<>
					<img alt="Lurkr" aria-label="Lurkr" className="size-5" height={20} src={logoSmall} width={20} />
					<span className="font-medium">Lurkr Docs</span>
				</>
			),
		},
		themeSwitch: {
			enabled: false,
		},
	};
}
