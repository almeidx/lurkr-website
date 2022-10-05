import Link from "next/link";

interface Section {
	links: {
		href: string;
		name: string;
	}[];
	title: string;
}

const sections: Section[] = [
	{
		links: [
			{
				href: "/support",
				name: "Discord",
			},
			{
				href: "https://pepe-is.life",
				name: "Pepe Emoji",
			},
			{
				href: "/github",
				name: "GitHub",
			},
		],
		title: "About Us",
	},
	{
		links: [
			{
				href: "/privacy",
				name: "Privacy Policy",
			},
			{
				href: "/terms",
				name: "Terms and Conditions",
			},
		],
		title: "Legal",
	},
];

export default function Footer() {
	return (
		<footer className="bg-discord-slightly-darker pb-8 shadow-sm sm:px-56">
			<div className="flex flex-col gap-12">
				<div className="ml-10 grid grid-rows-2 gap-6 pt-8 sm:ml-0 sm:grid-cols-2 sm:grid-rows-none sm:gap-0">
					{sections.map(({ links, title }, idx) => (
						<div className="flex flex-col gap-1 text-white" key={idx}>
							<span className="mb-2 font-bold text-gray-400">{title}</span>
							{links.map(({ href, name }, idx_) => (
								<Link href={href} key={idx_}>
									<a className="w-fit hover:underline">{name}</a>
								</Link>
							))}
						</div>
					))}
				</div>

				<span className="flex items-center justify-center text-sm font-light text-gray-300 sm:items-start sm:justify-start sm:text-base">
					Copyright © {new Date().getFullYear()} Pepe Emoji. All rights reserved.
				</span>
			</div>
		</footer>
	);
}
