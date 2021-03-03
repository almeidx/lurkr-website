import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/pages/Bot.module.css';

export default function Bot() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pepe Manager Bot</title>
      </Head>

      <header>
        <Image src="/assets/avatar.png" width={64} height={64} alt="Pepe Manager bot avatar image" />

        <h1>Pepe Manager</h1>
        <p>A Discord bot with focous on automation, leveling, emoji management, and image manipulation</p>
      </header>

      <div>
        <Link href="/bot-invite">Invite the bot</Link>
        {/* TODO: Change this href to /bot/dashboard once the dashboard is implemented */}
        <Link href="#">Go to dashboard</Link>
      </div>

      <main>
        <div className={styles.leftAlignedShowcase}>
          <span>Emoji List Channel</span>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <video autoPlay src="/assets/showcases/emoji-list.mp4" />
        </div>

        <div className={styles.rightAlignedShowcase}>
          <span>Emoji List Channel</span>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <video autoPlay src="/assets/showcases/emoji-list.mp4" />
        </div>

        <div className={styles.leftAlignedShowcase}>
          <span>Emoji List Channel</span>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <video autoPlay src="/assets/showcases/emoji-list.mp4" />
        </div>
      </main>

      <footer>yeet</footer>
    </div>
  );
}
