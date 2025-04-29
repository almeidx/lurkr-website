import logoSmall from "@/assets/logo-small.webp";
import { GITHUB_REPOSITORY_URL } from "@/shared-links.js";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<>
				<Image alt="Lurkr" src={logoSmall} sizes="20px" width={20} height={20} className="size-5" aria-label="Lurkr" />
				<span className="font-medium">Lurkr Docs</span>
			</>
		),
	},
	githubUrl: GITHUB_REPOSITORY_URL,
	themeSwitch: {
		enabled: false,
	},
};
