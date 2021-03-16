import axios from 'axios';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';

import Error from '../../../components/Error';
import api from '../../../services/api';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../../utils/constants';
import type { Guild as DiscordGuild } from '../../api/guilds';

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

export const getStaticProps: GetStaticProps<{ dbGuild: DatabaseGuild; id: string }> = async ({ params }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  try {
    const dbGuild = await api.get<DatabaseGuild>(`/database/guilds/${params.id}`).catch(() => null);
    if (!dbGuild?.data) return { notFound: true };

    return {
      props: {
        dbGuild: dbGuild.data,
        id: params.id,
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

export default function Guild({ dbGuild, id }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [guild, setGuild] = useState<DiscordGuild | null>(null);
  const [hasFailedToResolveGuild, setHasFailedToResolveGuild] = useState(false);
  const [session] = useSession();
  const { isFallback } = useRouter();

  useEffect(() => {
    if (id) {
      axios
        .get<DiscordGuild[]>('/api/guilds')
        .then(({ data }) => {
          const guild = data.find((g) => g.id === id);
          if (!guild) setHasFailedToResolveGuild(true);
          else setGuild(guild);
        })
        .catch(() => setHasFailedToResolveGuild(true));
    }
  }, [id]);

  if (hasFailedToResolveGuild) {
    return <Error message="Failed to resolve guild." statusCode={500} />;
  }

  if (isFallback || !guild) {
    return <h1>loading</h1>;
  }

  if (!session) {
    return <h1>not logged in lul</h1>;
  }

  return (
    <div>
      <img src={DISCORD_GUILD_CDN(guild.id, guild.icon) ?? FALLBACK_AVATAR} alt={`${guild.name} icon`} />

      {JSON.stringify(dbGuild)}
    </div>
  );
}
