import Image from 'next/image';
import Link from 'next/link';

import Showcase from '../components/Showcase';
import { showcases } from '../utils/constants';

interface ButtonData {
  path: string;
  text: string;
}

const buttons: ButtonData[] = [
  { path: '/invite', text: 'Invite the bot' },
  { path: '/guilds', text: 'Go to Dashboard' },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-discord-dark">
      <Image src="/static/avatar.png" width={64} height={64} />

      <header className="flex flex-col justify-center items-center py-5">
        <h1>Pepe Manager</h1>

        <p className="my-6 text-lg font-light text-center text-gray-400">
          A Discord bot with focus on automation, leveling, emoji management, and image manipulation
        </p>

        <div className="flex flex-row gap-4 justify-center items-center">
          {buttons.map(({ path, text }, i) => (
            <Link href={path} key={i}>
              <a className="flex justify-center py-2 px-3 w-40 text-white bg-blurple hover:bg-[#414AB9] rounded-md transition-colors duration-100">
                {text}
              </a>
            </Link>
          ))}
        </div>
      </header>

      <main className="flex flex-col gap-12 justify-center items-center my-12 max-w-screen-2xl">
        {showcases.map(({ description, src, title }, i) => (
          <Showcase key={i} align={i % 2 === 0 ? 'right' : 'left'} description={description} src={src} title={title} />
        ))}
      </main>
    </div>
  );
}
