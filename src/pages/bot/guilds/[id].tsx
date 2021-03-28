import type { APIGuild } from 'discord-api-types/v8';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useRef, useState } from 'react';

import Loading from '../../../components/Loading';
import api from '../../../services/api';
// import styles from '../../../styles/pages/bot/guilds/Guild.module.css';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../../utils/constants';

interface DatabaseGuild {
  _id: string;
  autoPublishChannels: string[] | null;
  autoRole: string[] | null;
  autoRoleTimeout: number | null;
  blacklistedChannels: string[] | null;
  counts: { count: number; date: Date }[];
  emojiList: boolean;
  emojiListChannel: string | null;
  lastRoleMentionAt: number | null;
  leftAt: number | null;
  levels: boolean;
  mentionCooldown: number;
  mentionCooldownRoles: string[] | null;
  milestones: { count: number; member: string }[];
  milestonesChannel: string | null;
  noXpRoles: string[] | null;
  prefix: string;
  premium: boolean;
  stackXpRoles: boolean;
  storeCounts: boolean;
  storeMilestones: boolean;
  topXp: string | null;
  topXpRole: string | null;
  xpBlacklistedChannels: string[] | null;
  xpRoles: Map<string, string[]>;
  xpWhitelistedChannels: string[] | null;
}

interface APIResponse {
  db: DatabaseGuild;
  guild: APIGuild;
}

export const getStaticProps: GetStaticProps<APIResponse> = async ({ params }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  try {
    const response = await api.get<APIResponse>(`/guilds/${params.id}`).catch(() => null);
    if (!response?.data) return { notFound: true };

    return {
      props: {
        ...response.data,
      },
      revalidate: 60,
    };
  } catch {
    return { notFound: true };
  }
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  };
};

export default function Guild({ db, guild }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isFallback } = useRouter();
  const [session] = useSession();
  const prefixRef = useRef<HTMLInputElement>(null);
  const [localDb, setLocalDb] = useState<DatabaseGuild | undefined>(db);

  if (isFallback) {
    return <Loading />;
  }

  if (!session) {
    return <h1>not logged in lul</h1>;
  }

  function updateLocalDb<T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) {
    const clone = Object.assign({}, localDb);
    clone[key] = value;
    setLocalDb(clone);
  }

  console.log(guild);

  return (
    <div>
      <div>
        <img src={DISCORD_GUILD_CDN(guild.id, guild.icon) ?? FALLBACK_AVATAR} alt={`${guild.name} icon`} />
        <span>{guild.name}</span>
      </div>

      <main>
        <section>
          <label htmlFor="prefix">Prefix</label>
          <input id="prefix" defaultValue={db.prefix} ref={prefixRef} type="text" />
        </section>

        <section>
          <h1>Levelling</h1>
          <label htmlFor="levelling">Enabled</label>
          <input
            id="levelling"
            type="checkbox"
            name="Enabled"
            checked={localDb?.levels}
            onChange={(e) => updateLocalDb('levels', e.target.checked)}
          />

          <label htmlFor="xpChannels">XP Channels</label>
          <input list="channels" name="channel" id="xpChannels" />
          <datalist id="channels">
            {guild.channels
              ?.filter((c) => c.type === 0)
              .map((c) => (
                <option key={c.id} value={`#${c.name!}`} />
              ))}
          </datalist>
        </section>
      </main>
    </div>
  );
}
