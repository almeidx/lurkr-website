import Showcase, { ShowcaseProps } from '@components/Showcase';
import styles from '@styles/pages/Home.module.scss';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const showcases: ShowcaseProps[] = [
  {
    align: 'left',
    description:
      "Almost all levelling systems have one massive drawback: you need to pay to get any sort of meaningful features. With Pepe Manager we aim to give you a fully functional levelling system without having to pay for basic features. You can add limitless role rewards, with up to 5 roles per level-up, feature-rich leaderboard embed with pagination up to 100 members, a custom rank card with colour-coordination, the ability to add roles that don't earn any XP, the ability to whitelist which channels users can gain XP in, whether or not role rewards can stack, or whether levels are even enabled or not, with so many more free features in the works!",
    path: '/assets/showcases/levelling.mp4',
    title: 'No-Paywall Levelling System',
  },
  {
    align: 'right',
    description:
      "As if emoji servers couldn't be even more automated, with Pepe Manager you can now set automated emoji list channels which will not only obviously list all emojis in a convenient copy+paste format, but will also update itself whenever you add, remove, rename or update any and/or all emojis! Set it and forget it, and keep all of your emojis sorted alphabetically easily and worry-free!",
    path: '/assets/showcases/emoji-list.mp4',
    title: 'Emoji List Channels',
  },
  {
    align: 'left',
    description:
      "We get it, MEE6 is very popular, and there's no shame in running levelling through MEE6, but if you want we offer a fully automatic way to import your MEE6 leaderboard directly into Pepe Manager! By default it will import all user data down to level 5, which can be adjusted down to level 3 for smaller servers. Make the leap into paywall freedom with Pepe Manager!",
    path: '/assets/showcases/mee6-import.mp4',
    title: 'Super Simple Levelling Migration',
  },
  {
    align: 'right',
    description:
      "Every way you want and need to interact with your emojis, you can now do so easily and competently with Pepe Manager. Whether you're on-the-go on mobile, or simply prefer the speed and simplicity of commands, Pepe Manager allows you to create, rename, delete and even re-upload emojis. For extra utility, Pepe Manager also offers a fast search command to look through all of your server emotes with keywords, or if you're feeling lucky, ask it to show you a random emote from your server!",
    path: '/assets/showcases/emojis.mp4',
    title: 'All Inclusive Emoji Management',
  },
  {
    align: 'left',
    description:
      'Pepe Manager can be as utilitarian or as entertaining as you want it to be! With 20+ image manipulation commands currently supported and with more on the way, Pepe Manager can turn your avatar, the server icon, other people avatar and basically any image you throw at it, and manipulate it to fit our Pepe-based templates! Make your avatar drive a toy police car, see it in a hazmat suit, have it peek around a brick wall or even make Pepe hold up a sign with your custom text on it!',
    path: '/assets/showcases/images.mp4',
    title: 'Fun & Flavourful Image Manipulation',
  },
];

export default function Bot() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pepe Manager Bot</title>
      </Head>

      <header>
        <Image src="/assets/avatar.png" width={64} height={64} alt="Pepe Manager bot avatar image" />

        <h1>Pepe Manager</h1>
        <p>A Discord bot with focus on automation, leveling, emoji management, and image manipulation</p>
      </header>

      <div className={styles.linkContainer}>
        <Link href="/invite">Invite the bot</Link>
        <Link href="/guilds">Go to dashboard</Link>
      </div>

      <main className={styles.showcaseContainer}>
        {showcases.map(({ align, description, path, title }, i) => (
          <Showcase key={i} align={align} description={description} path={path} title={title} />
        ))}
      </main>
    </div>
  );
}
