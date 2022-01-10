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
    <div className="bg-discord-dark flex items-center flex-col">
      <Image src="/static/avatar.png" width={64} height={64} />

      <header className="py-5 flex flex-col justify-center items-center">
        <h1>Pepe Manager</h1>

        <p className="my-6 text-gray-400 text-lg font-light text-center">
          A Discord bot with focus on automation, leveling, emoji management, and image manipulation
        </p>

        <div className="flex flex-row justify-center items-center gap-4">
          {buttons.map(({ path, text }, i) => (
            <Link href={path} key={i}>
              <a className="w-40 px-3 py-2 bg-blurple hover:bg-[#414AB9] transition-colors duration-100 rounded-md text-white flex justify-center">
                {text}
              </a>
            </Link>
          ))}
        </div>
      </header>

      <main className="flex flex-col justify-center items-center max-w-screen-2xl gap-12 my-12">
        {showcases.map(({ description, src, title }, i) => (
          <Showcase key={i} align={i % 2 === 0 ? 'right' : 'left'} description={description} src={src} title={title} />
        ))}
      </main>
    </div>
  );
}
