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

      <header className="flex flex-col items-center justify-center py-5">
        <h1>Pepe Manager</h1>

        <p className="my-6 text-center text-lg font-light text-gray-400">
          A Discord bot with focus on automation, leveling, emoji management, and image manipulation
        </p>

        <div className="flex flex-row items-center justify-center gap-4">
          {buttons.map(({ path, text }, i) => (
            <Link href={path} key={i}>
              <a className="flex w-40 justify-center rounded-md bg-blurple py-2 px-3 text-white transition-colors duration-100 hover:bg-[#414AB9]">
                {text}
              </a>
            </Link>
          ))}
        </div>
      </header>

      <main className="my-12 flex max-w-screen-2xl flex-col items-center justify-center gap-12">
        {showcases.map(({ description, src, title }, i) => (
          <Showcase key={i} align={i % 2 === 0 ? 'right' : 'left'} description={description} src={src} title={title} />
        ))}
      </main>
    </div>
  );
}
