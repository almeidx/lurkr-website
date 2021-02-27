import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/components/Navbar.module.css';

export default function Navbar() {
  const router = useRouter();

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
        <button>Login</button>
      </div>
    </nav>
  );
}
