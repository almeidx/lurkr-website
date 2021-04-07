import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
// import { signIn, signOut, useSession } from 'next-auth/client';
import { FaDiscord } from 'react-icons/fa';

import { UserContext } from '../contexts/UserContext';
import styles from '../styles/components/Navbar.module.css';
import { API_BASE_URL, DISCORD_USER_AVATAR_CDN } from '../utils/constants';

export default function Navbar() {
  const router = useRouter();
  const { authenticated, avatar, id, username, discriminator } = useContext(UserContext);
  // const [session] = useSession();

  const handleSignInClick = () => {
    window.open(`${API_BASE_URL}/auth`, '_self');
  };

  const handleLogoutClick = () => {
    window.open(`${API_BASE_URL}/auth/logout`, '_self');
  };

  return (
    <nav className={styles.navbarContainer}>
      <span onClick={() => router.push('/')}>PEPE MANAGER</span>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/bot">Bot</Link>
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
          <Link href="/merch">Merch</Link>
        </li>
        <li>
          <Link href="https://discord.gg/pepe">Support Server</Link>
        </li>
      </ul>
      <div>
        {authenticated ? (
          <button className={styles.signOutButton} onClick={handleLogoutClick}>
            {avatar && (
              <img
                width={'1rem'}
                height={'1rem'}
                src={DISCORD_USER_AVATAR_CDN(id, avatar)}
                alt="Your profile picture"
              />
            )}
            {username}#{discriminator} - Sign out
          </button>
        ) : (
          <button className={styles.signInButton} onClick={handleSignInClick}>
            <FaDiscord /> Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
