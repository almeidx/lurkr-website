import Link from 'next/link';

const sections = [
  {
    title: 'About Us',
    links: [
      { href: 'https://discord.gg/pepe', name: 'Discord' },
      { href: '/bot', name: 'Pepe Manager' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', name: 'Privacy Policy' },
      { href: '/terms', name: 'Terms and Conditions' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="pb-8 bg-discord-slightly-darker sm:px-56 shadow-sm">
      <div className="flex flex-col gap-12">
        <div className="grid grid-rows-2 ml-10 sm:ml-0 sm:grid-cols-2 sm:grid-rows-none gap-6 sm:gap-0 pt-8">
          {sections.map(({ links, title }, i) => (
            <div key={i} className="flex flex-col text-white">
              <span className="text-gray-500">{title}</span>
              {links.map(({ href, name }, j) => (
                <Link key={j} href={href}>
                  <a className="hover:underline">{name}</a>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <span className="text-gray-300 text-sm sm:text-base flex justify-center items-center sm:justify-start sm:items-start">
          Copyright © {new Date().getFullYear()} Pepe Emoji. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
