import { stripIndents } from 'common-tags';

import type { ShowcaseProps } from '../components/Showcase';

export const showcases: Omit<ShowcaseProps, 'align'>[] = [
  {
    description:
      "Almost all levelling systems have one massive drawback: you need to pay to get any sort of meaningful features. With Pepe Manager we aim to give you a fully functional levelling system without having to pay for basic features. You can add limitless role rewards, with up to 5 roles per level-up, feature-rich leaderboard embed with pagination up to 100 members, a custom rank card with colour-coordination, the ability to add roles that don't earn any XP, the ability to whitelist which channels users can gain XP in, whether or not role rewards can stack, or whether levels are even enabled or not, with so many more free features in the works!",
    src: '/static/showcases/levelling.mp4',
    title: 'No-Paywall Levelling System',
  },
  {
    description:
      "As if emoji servers couldn't be even more automated, with Pepe Manager you can now set automated emoji list channels which will not only obviously list all emojis in a convenient copy+paste format, but will also update itself whenever you add, remove, rename or update any and/or all emojis! Set it and forget it, and keep all of your emojis sorted alphabetically easily and worry-free!",
    src: '/static/showcases/emoji-list.mp4',
    title: 'Emoji List Channels',
  },
  {
    description:
      "We get it, MEE6 is very popular, and there's no shame in running levelling through MEE6, but if you want we offer a fully automatic way to import your MEE6 leaderboard directly into Pepe Manager! By default it will import all user data down to level 5, which can be adjusted down to level 3 for smaller servers. Make the leap into paywall freedom with Pepe Manager!",
    src: '/static/showcases/mee6-import.mp4',
    title: 'Super Simple Levelling Migration',
  },
  {
    description:
      "Every way you want and need to interact with your emojis, you can now do so easily and competently with Pepe Manager. Whether you're on-the-go on mobile, or simply prefer the speed and simplicity of commands, Pepe Manager allows you to create, rename, delete and even re-upload emojis. For extra utility, Pepe Manager also offers a fast search command to look through all of your server emotes with keywords, or if you're feeling lucky, ask it to show you a random emote from your server!",
    src: '/static/showcases/emojis.mp4',
    title: 'All Inclusive Emoji Management',
  },
  {
    description:
      'Pepe Manager can be as utilitarian or as entertaining as you want it to be! With 20+ image manipulation commands currently supported and with more on the way, Pepe Manager can turn your avatar, the server icon, other people avatar and basically any image you throw at it, and manipulate it to fit our Pepe-based templates! Make your avatar drive a toy police car, see it in a hazmat suit, have it peek around a brick wall or even make Pepe hold up a sign with your custom text on it!',
    src: '/static/showcases/images.mp4',
    title: 'Fun & Flavourful Image Manipulation',
  },
];

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://api.pepemanager.com';

export const BOT_API_BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4444/bot' : 'https://api.pepemanager.com/bot';

export const appleIcons: { href: string; media: string }[] = [
  {
    href: 'icons/apple-splash-2048-2732.png',
    media:
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2732-2048.png',
    media:
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1668-2388.png',
    media:
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2388-1668.png',
    media:
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1536-2048.png',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2048-1536.png',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1668-2224.png',
    media:
      '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2224-1668.png',
    media:
      '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1620-2160.png',
    media:
      '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2160-1620.png',
    media:
      '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1284-2778.png',
    media:
      '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2778-1284.png',
    media:
      '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1170-2532.png',
    media:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2532-1170.png',
    media:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1125-2436.png',
    media:
      '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2436-1125.png',
    media:
      '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1242-2688.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2688-1242.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-828-1792.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-1792-828.png',
    media:
      '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-1242-2208.png',
    media:
      '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-2208-1242.png',
    media:
      '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-750-1334.png',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-1334-750.png',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: 'icons/apple-splash-640-1136.png',
    media:
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: 'icons/apple-splash-1136-640.png',
    media:
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
];

export const keywords: string[] = [
  'Pepe',
  'Peepo',
  'Pepe Manager',
  'Pepe Manager Bot',
  'Pepe Manager Bot Discord',
  'Pepe Manager Discord',
  'Pepe Manager Discord Server',
  'Pepe Manager Discord Guild',
  'Emoji Manager',
  'Emoji Manager Discord',
  'Pepe Manager Invite',
  'Pepe Manager Bot Invite',
];

// https://discord.com/developers/docs/reference#snowflakes
export const MIN_SNOWFLAKE = 0b000000000000000000000000000000000000000000_00001_00001_000000000001;

// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
export const MAX_SNOWFLAKE = BigInt('0b1111111111111111111111111111111111111111111111111111111111111111');

export const FALLBACK_AVATAR_PATH = '/static/fallback-avatar.png';

export const DEFAULT_ROLE_COLOUR = 'rgb(185, 187, 190)';

/**
 * Gets the XP required to achieve a level
 * @info un = 100 + 50 * (n - 1) ** 2
 * @param n The level
 * @returns The XP required
 */
export const XP = (n: number): number => (n === 0 ? 0 : 100 + 50 * (n - 1) ** 2);

export const DATABASE_DEFAULTS = {
  autoResetLevels: 0 as const,
  emojiList: false,
  levels: false,
  mentionCooldown: 600_000,
  milestonesInterval: 100,
  milestonesMessage: stripIndents`
    <a:aPES_Cog:498482209494401054><a:aPES_Cog:498482209494401054><a:aPES_Cog:498482209494401054>
    **{milestone} Members**
    <a:aPES_Cog:498482209494401054><a:aPES_Cog:498482209494401054><a:aPES_Cog:498482209494401054>

    <:PES2_Party:685143619501293616> Congratulations to {user}, you were the {milestone}th person to join!
  `,
  prefix: 'p!',
  prioritiseMultiplierRoleHierarchy: false,
  stackXpRoles: true,
  storeCounts: true,
  storeMilestones: false,
  xpMessage: '<:PES_Stonks:800129864870133760> {user} has reached level **{level}**',
  xpResponseType: 'channel' as const,
};

export const DATABASE_LIMITS = {
  autoPublishChannels: {
    maxLength: 5,
  },
  autoRole: {
    maxLength: 5,
  },
  autoRoleTimeout: {
    max: 1_800_000,
    min: 60_000,
  },
  blacklistedChannels: {
    maxLength: 20,
  },
  mentionCooldown: {
    max: 1_800_000,
    min: 300_000,
  },
  mentionCooldownRoles: {
    maxLength: 25,
  },
  milestonesInterval: {
    max: 100_000,
    min: 10,
  },
  milestonesMessage: {
    maxLength: 1_000,
  },
  milestonesRoles: {
    maxLength: 5,
  },
  noXpRoles: {
    maxLength: 30,
  },
  prefix: {
    maxLength: 5,
  },
  vanity: {
    maxLength: 32,
    minLength: 2,
  },
  xpChannels: {
    maxLength: 30,
  },
  xpMessage: {
    maxLength: 1_000,
  },
  xpMultiplierTargets: {
    maxLength: 30,
  },
  xpMultipliers: {
    maxLength: 10,
  },
  xpRolesPerLevel: {
    maxLength: 5,
  },
};

export const DATABASE_PREMIUM_LIMITS = {
  autoPublishChannels: {
    maxLength: 25,
  },
  autoRole: {
    maxLength: 25,
  },
  autoRoleTimeout: {
    max: 1_800_000,
    min: 60_000,
  },
  blacklistedChannels: {
    maxLength: 20,
  },
  mentionCooldown: {
    max: 1_800_000,
    min: 300_000,
  },
  mentionCooldownRoles: {
    maxLength: 25,
  },
  milestonesInterval: {
    max: 100_000,
    min: 10,
  },
  milestonesMessage: {
    maxLength: 1_000,
  },
  milestonesRoles: {
    maxLength: 10,
  },
  noXpRoles: {
    maxLength: 30,
  },
  prefix: {
    maxLength: 5,
  },
  vanity: {
    maxLength: 32,
    minLength: 2,
  },
  xpChannels: {
    maxLength: 50,
  },
  xpMessage: {
    maxLength: 1_000,
  },
  xpMultiplierTargets: {
    maxLength: 50,
  },
  xpMultipliers: {
    maxLength: 25,
  },
  xpRolesPerLevel: {
    maxLength: 25,
  },
};
