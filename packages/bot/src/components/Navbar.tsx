import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { GoSignIn, GoSignOut } from 'react-icons/go';
import { MdClose, MdMenu } from 'react-icons/md';

import { UserContext } from '../contexts/UserContext';
import useClickOutside from '../hooks/useClickOutside';
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
  const router = useRouter();
  const { authenticated, avatar, discriminator, id, username } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setDropdownOpen(false);
  }, [router]);

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
    console.log(dropdownOpen);
  };

  const handleClickOutside = () => {
    setDropdownOpen(false);
    console.log(dropdownOpen);
  };

  useClickOutside(dropdownRef, handleClickOutside);

  return (
    <div ref={dropdownRef} className="w-full bg-discord-dark">
      <header className="flex md:items-center p-6 max-w-[992px] xl:max-w-[1440px] mx-auto">
        <Link href="/">
          <a className=" md:text-xl py-1 md:p-0 text-white uppercase font-bold whitespace-nowrap mr-4">Pepe Manager</a>
        </Link>

        <nav className="md:w-full ml-auto z-20">
          <span onClick={handleDropdownClick}>
            {dropdownOpen ? (
              <MdClose className="w-6 h-6 my-1 md:hidden text-2xl text-white cursor-pointer" />
            ) : (
              <MdMenu className="w-6 h-6 my-1 md:hidden text-2xl text-white cursor-pointer" />
            )}
          </span>

          <nav
            className={`${
              dropdownOpen ? 'block' : 'hidden'
            } md:block absolute md:relative z-50 w-full mt-6 md:mt-0 left-0 bg-discord-not-quite-black md:bg-transparent`}
          >
            <ul className="flex flex-col md:flex-row py-4 pr-4 md:p-0 gap-4 md:items-center">
              {links.map(
                ({ name, requireAuth, url }, i) =>
                  (!requireAuth || authenticated) && (
                    <li key={i}>
                      <Link href={url}>
                        <a className="block w-full px-4 md:px-0 font-normal leading-7 text-gray-300 md:text-gray-500 hover:underline">
                          {name}
                        </a>
                      </Link>
                    </li>
                  ),
              )}
              {authenticated ? (
                <button
                  className="text-white cursor-pointer px-2 py-1 mx-2 md:mx-0 md:ml-auto rounded-md flex bg-gray-700 md:bg-transparent flex-row justify-center items-center gap-3 duration-200 hover:bg-discord-lighter focus:outline-none mt-6 md:mt-0"
                  onClick={() => window.open(`${API_BASE_URL}/auth/logout`, '_self')}
                >
                  {avatar && (
                    <img
                      alt="Your profile picture"
                      className="block rounded-full"
                      height={30}
                      src={userAvatarCdn(id, avatar, 32)}
                      width={30}
                    />
                  )}
                  {username}#{discriminator}
                  <GoSignOut />
                </button>
              ) : (
                <button
                  className="text-white px-2 py-1 mx-2 md:ml-auto md:mx-0 bg-blurple rounded-md shadow-md flex flex-row justify-center items-center gap-2 duration-150 hover:bg-lighter-blurple focus:outline-none mt-6 md:mt-0"
                  onClick={() => window.open(`${API_BASE_URL}/auth`, '_self')}
                >
                  Sign in
                  <GoSignIn />
                </button>
              )}
            </ul>
          </nav>
        </nav>
      </header>
    </div>
  );
}
