import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/components/Navbar.module.css';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.navbarContainer}>
      <span onClick={() => router.push('/')}>PEPE EMOJIS</span>
      <ul className={styles.linksContainer}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="https://pepemanager.com">Pepe Manager</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy</Link>
        </li>
        <li>
          <Link href="/terms">Terms</Link>
        </li>
      </ul>
    </nav>
  );
}
