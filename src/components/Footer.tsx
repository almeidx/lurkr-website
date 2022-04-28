import Link from 'next/link';

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
      { href: 'https://discord.gg/XUQAnkq2vy', name: 'Discord' },
      { href: 'https://pepe-is.life', name: 'Pepe Emoji' },
      { href: '/github', name: 'GitHub' },
    ],
    title: 'About Us',
  },
  {
    links: [
      { href: '/privacy', name: 'Privacy Policy' },
      { href: '/terms', name: 'Terms and Conditions' },
    ],
    title: 'Legal',
  },
];

export default function Footer() {
  return (
    <footer className="pb-8 bg-discord-slightly-darker shadow-sm sm:px-56">
      <div className="flex flex-col gap-12">
        <div className="grid grid-rows-2 gap-6 pt-8 ml-10 sm:grid-cols-2 sm:grid-rows-none sm:gap-0 sm:ml-0">
          {sections.map(({ links, title }, i) => (
            <div key={i} className="flex flex-col gap-1 text-white">
              <span className="mb-2 font-bold text-gray-400">{title}</span>
              {links.map(({ href, name }, j) => (
                <Link key={j} href={href}>
                  <a className="w-fit hover:underline">{name}</a>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <span className="flex justify-center items-center text-sm font-light text-gray-300 sm:justify-start sm:items-start sm:text-base">
          Copyright © {new Date().getFullYear()} Pepe Emoji. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
