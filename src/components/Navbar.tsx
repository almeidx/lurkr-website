import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  { name: 'Status', url: '/status' },
];

export default function Navbar() {
  const router = useRouter();
  const { authenticated, avatar, discriminator, id, username } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => setDropdownOpen(false), [router]);

  const handleDropdownClick = useCallback(() => setDropdownOpen(!dropdownOpen), [dropdownOpen]);
  const handleClickOutside = useCallback(() => setDropdownOpen(false), []);

  useClickOutside(dropdownRef, handleClickOutside);

  return (
    <div ref={dropdownRef} className="w-full bg-discord-dark">
      <header className="flex p-6 mx-auto max-w-[992px] md:items-center xl:max-w-[1440px]">
        <Link href="/">
          <a className=" py-1 mr-4 font-bold text-white uppercase whitespace-nowrap md:p-0 md:text-xl">Pepe Manager</a>
        </Link>

        <nav className="z-20 ml-auto md:w-full">
          <span onClick={handleDropdownClick}>
            {dropdownOpen ? (
              <MdClose className="my-1 w-6 h-6 text-2xl text-white cursor-pointer md:hidden" />
            ) : (
              <MdMenu className="my-1 w-6 h-6 text-2xl text-white cursor-pointer md:hidden" />
            )}
          </span>

          <nav
            className={`${
              dropdownOpen ? 'block' : 'hidden'
            } md:block absolute md:relative z-50 w-full mt-6 md:mt-0 left-0 bg-discord-not-quite-black md:bg-transparent`}
          >
            <ul className="flex flex-col gap-4 py-4 pr-4 md:flex-row md:items-center md:p-0">
              {links.map(
                ({ name, requireAuth, url }, i) =>
                  (!requireAuth || authenticated) && (
                    <li key={i}>
                      <Link href={url}>
                        <a className="block px-4 w-full font-normal leading-7 text-gray-300 hover:underline md:px-0 md:text-gray-400">
                          {name}
                        </a>
                      </Link>
                    </li>
                  ),
              )}

              {authenticated ? (
                <div className="flex flex-row gap-2 mx-2 mt-6 text-white md:mx-0 md:mt-0 md:ml-auto">
                  <Link href="/guilds">
                    <a className="flex flex-row gap-2 justify-center items-center py-1 px-2 bg-gray-700 hover:bg-discord-lighter rounded-md focus:outline-none duration-200 cursor-pointer md:bg-transparent">
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
                    </a>
                  </Link>

                  <button
                    className="flex justify-center items-center py-1 px-2 w-10 h-auto content-none bg-gray-700 hover:bg-red-500 rounded-md focus:outline-none duration-200 cursor-pointer md:bg-transparent"
                    onClick={() => window.open(`${API_BASE_URL}/auth/logout`, '_self')}
                  >
                    <GoSignOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  className="flex flex-row gap-2 justify-center items-center py-1 px-2 mx-2 mt-6 text-white bg-blurple hover:bg-[#414AB9] rounded-md focus:outline-none shadow-md transition-colors duration-100  md:mx-0 md:mt-0 md:ml-auto"
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
