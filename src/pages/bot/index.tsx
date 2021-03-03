import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/pages/Bot.module.css';

export default function Bot() {
  return (
    <div className={styles.container}>
      <header>
        <Image src="/images/avatar.png" width={64} height={64} alt="Pepe Manager bot avatar image" />

        <h1>Pepe Manager</h1>
        <p>A Discord bot with focous on automation, leveling, emoji management, and image manipulation</p>
      </header>

      <div>
        <Link href="/bot-invite">Invite the bot</Link>
        <Link href="/bot/dashboard">Go to dashboard</Link>
      </div>

      <main></main>
    </div>
  );
}
