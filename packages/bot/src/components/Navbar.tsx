import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { FaDiscord } from 'react-icons/fa';

import { UserContext } from '../contexts/UserContext';
import styles from '../styles/components/Navbar.module.scss';
import { API_BASE_URL, DISCORD_USER_AVATAR_CDN } from '../utils/constants';

// const popup = (url: string, title: string, w: number, h: number) => {
//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

//   const width = window.innerWidth
//     ? window.innerWidth
//     : document.documentElement.clientWidth
//     ? document.documentElement.clientWidth
//     : screen.width;

//   const height = window.innerHeight
//     ? window.innerHeight
//     : document.documentElement.clientHeight
//     ? document.documentElement.clientHeight
//     : screen.height;

//   const systemZoom = width / window.screen.availWidth;

//   const left = (width - w) / 2 / systemZoom + dualScreenLeft;
//   const top = (height - h) / 2 / systemZoom + dualScreenTop;

//   const newWindow = window.open(
//     url,
//     title,
//     `
//     scrollbars=yes,
//     width=${w / systemZoom},
//     height=${h / systemZoom},
//     top=${top},
//     left=${left}
//     menubar=0,
//     toolbar=0
//     `,
//   );

//   newWindow?.focus();
// };

export default function Navbar() {
  const router = useRouter();
  const { authenticated, avatar, id, username, discriminator } = useContext(UserContext);

  return (
    <nav className={styles.navbarContainer}>
      <span onClick={() => router.push('/')}>PEPE MANAGER</span>
      <ul className={styles.linksContainer}>
        <li>
          <Link href="/">Home</Link>
        </li>
        {authenticated && (
          <li>
            <Link href="/guilds">Dashboard</Link>
          </li>
        )}
        <li>
          <Link href="/levels">Levels</Link>
        </li>
        <li>
          <Link href="https://discord.gg/pepe">Support Server</Link>
        </li>
        <li>
          <Link href="https://pepe-is.life">Pepe Emojis</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy</Link>
        </li>
        <li>
          <Link href="/terms">Terms</Link>
        </li>
      </ul>

      <div>
        {authenticated ? (
          <button className={styles.signOutButton} onClick={() => window.open(`${API_BASE_URL}/auth/logout`, '_self')}>
            {avatar && (
              <img
                width={'30px'}
                height={'30px'}
                src={DISCORD_USER_AVATAR_CDN(id, avatar)}
                alt="Your profile picture"
              />
            )}
            {username}#{discriminator} - Sign out
          </button>
        ) : (
          <button className={styles.signInButton} onClick={() => window.open(`${API_BASE_URL}/auth`, '_self')}>
            <FaDiscord /> Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
