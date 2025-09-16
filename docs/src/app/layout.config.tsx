import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import logoSmall from "@/assets/logo-small.webp";
import { GITHUB_REPOSITORY_URL } from "@/shared-links.ts";

export const baseOptions: BaseLayoutProps = {
	githubUrl: GITHUB_REPOSITORY_URL,
	nav: {
		title: (
			<>
				<Image alt="Lurkr" aria-label="Lurkr" className="size-5" height={20} sizes="20px" src={logoSmall} width={20} />
				<span className="font-medium">Lurkr Docs</span>
			</>
		),
	},
	themeSwitch: {
		enabled: false,
	},
};
