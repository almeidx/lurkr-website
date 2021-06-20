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
      { href: 'https://discord.gg/pepe', name: 'Discord' },
      { href: '/bot', name: 'Pepe Manager' },
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
    <footer className="pb-8 bg-discord-slightly-darker sm:px-56 shadow-sm">
      <div className="flex flex-col gap-12">
        <div className="grid grid-rows-2 ml-10 sm:ml-0 sm:grid-cols-2 sm:grid-rows-none gap-6 sm:gap-0 pt-8">
          {sections.map(({ links, title }, i) => (
            <div key={i} className="flex flex-col text-white gap-1">
              <span className="text-gray-400 mb-2 font-bold">{title}</span>
              {links.map(({ href, name }, j) => (
                <Link key={j} href={href}>
                  <a className="hover:underline">{name}</a>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <span className="text-gray-300 font-light text-sm sm:text-base flex justify-center items-center sm:justify-start sm:items-start">
          Copyright © {new Date().getFullYear()} Pepe Emoji. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
