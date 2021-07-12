import Image from 'next/image';
import Link from 'next/link';

import pepeImg from '../../public/static/avatar.png';
import Showcase from '../components/Showcase';
import { showcases } from '../utils/constants';

export default function Home() {
  return (
    <div className="bg-discord-dark min-h-screen flex items-center flex-col">
      <Image src={pepeImg} width={64} height={64} placeholder="blur" />

      <header className="py-5 flex flex-col justify-center items-center">
        <h1>Pepe Manager</h1>

        <p className="my-6 text-gray-400 text-lg font-light text-center">
          A Discord bot with focus on automation, leveling, emoji management, and image manipulation
        </p>

        <div className="flex flex-row justify-center items-center gap-4">
          <Link href="/invite">
            <a className="w-40 px-3 py-2 bg-blurple rounded-md text-white flex justify-center">Invite the bot</a>
          </Link>
          <Link href="/guilds">
            <a className="w-40 px-3 py-2 bg-blurple rounded-md text-white flex justify-center">Go to Dashboard</a>
          </Link>
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
