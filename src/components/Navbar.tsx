import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/client';
import { FaDiscord } from 'react-icons/fa';

import styles from '../styles/components/Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [session] = useSession();

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
        {session && (
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
        {session ? (
          <button className={styles.signOutButton} onClick={() => signOut({ callbackUrl: window.location.href })}>
            {session.user.image && (
              <img width={'1rem'} height={'1rem'} src={session.user.image} alt="Your profile picture" />
            )}
            {session.user.name} - Sign out
          </button>
        ) : (
          <button className={styles.signInButton} onClick={() => signIn('discord')}>
            <FaDiscord /> Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
