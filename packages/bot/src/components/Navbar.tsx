import Link from 'next/link';
import { useContext, useState } from 'react';
import { GoSignIn, GoSignOut } from 'react-icons/go';
import { MdMenu } from 'react-icons/md';

import { UserContext } from '../contexts/UserContext';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { userAvatarCdn } from '../utils/cdn';
import { API_BASE_URL } from '../utils/constants';

const links: { name: string; requireAuth?: boolean; url: string }[] = [
  { name: 'Home', url: '/' },
  { name: 'Dashboard', requireAuth: true, url: '/guilds' },
  { name: 'Levels', url: '/levels' },
  { name: 'Calculator', url: '/levels/calculator' },
  { name: 'Tutorials', url: '/tutorials' },
  { name: 'Docs', url: '/docs' },
  { name: 'Support Server', url: 'https://discord.gg/pepe' },
];

export default function Navbar() {
  const { authenticated, avatar, discriminator, id, username } = useContext(UserContext);
  const [isMenuClosed, setIsMenuClosed] = useState(true);
  const { width } = useWindowDimensions();

  return (
    <header className="flex flex-row justify-between items-center py-6 px-6 md:gap-12 bg-discord-dark ">
      <Link href="/">
        <a className="text-white md:text-xl ml-4 mr-8 whitespace-nowrap text-center uppercase font-bold">
          Pepe Manager
        </a>
      </Link>

      <button
        className="inline-block md:hidden w-8 h-8 text-white p-1 content-none fill-current transition-colors duration-150 active:text-gray-400"
        onClick={() => setIsMenuClosed(!isMenuClosed)}
      >
        <MdMenu className="w-full h-full" />
      </button>

      <nav
        className={`${
          width ? (isMenuClosed && width < 768 ? 'hidden' : 'flex') : 'flex'
        } absolute md:relative top-16 left-0 md:top-0 z-20 flex-col md:flex-row md:gap-6 font-semibold w-full bg-discord-not-quite-black shadow-md rounded-lg md:rounded-none md:shadow-none md:bg-transparent p-6 pt-0 md:p-0 `}
      >
        <div className="flex flex-col md:flex-row md:items-center mt-6 md:mt-0 mr-auto gap-6">
          {links.map(
            ({ name, requireAuth, url }, i) =>
              (!requireAuth || authenticated) && (
                <Link href={url} key={i}>
                  <a className="font-normal leading-7 text-gray-300 md:text-gray-500 hover:underline">{name}</a>
                </Link>
              ),
          )}
        </div>

        {authenticated ? (
          <button
            className="text-white px-2 py-1 rounded-md flex bg-gray-700 md:bg-transparent flex-row justify-center items-center gap-3 duration-200 hover:bg-discord-lighter focus:outline-none mt-6 md:mt-0"
            onClick={() => window.open(`${API_BASE_URL}/auth/logout`, '_self')}
          >
            {avatar && (
              <img
                alt="Your profile picture"
                className="rounded-full"
                height={30}
                src={userAvatarCdn(id, avatar, 32)}
                width={30}
              />
            )}
            <span className="truncate max-w-[5rem] lg:max-w-none">
              {username}#{discriminator}
            </span>
            <GoSignOut />
          </button>
        ) : (
          <button
            className="text-white px-2 py-1 bg-blurple rounded-md shadow-md flex flex-row justify-center items-center gap-2 duration-150 hover:bg-lighter-blurple focus:outline-none mt-6 md:mt-0"
            onClick={() => window.open(`${API_BASE_URL}/auth`, '_self')}
          >
            Sign in
            <GoSignIn />
          </button>
        )}
      </nav>
    </header>
  );
}
