import Link from 'next/link';

const links: { name: string; url: string }[] = [
  { name: 'Home', url: '/' },
  { name: 'Pepe Manager', url: '/bot' },
];

export default function Navbar() {
  return (
    <nav className="grid h-16 bg-discord-dark grid-cols-3 sm:grid-cols-4 gap-6">
      <span className="text-white flex justify-center items-center text-center uppercase font-bold text-base sm:text-xl">
        Pepe Emoji
      </span>

      <div className="text-gray-400 w-full flex justify-flex-start items-center flex-row gap-4 col-span-2 sm:col-span-3">
        {links.map(({ name, url }, i) => (
          <Link key={i} href={url}>
            <a className="duration-150 hover:text-gray-300 text-sm sm:text-base">{name}</a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
