import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

import Spinner from '../../components/Spinner';
import { initializeApollo } from '../../graphql/client';
import GUILD_LEVELS, { GuildLevels, Levels } from '../../graphql/queries/GuildLevels';
import { isValidSnowflake } from '../../utils/utils';

interface LeaderboardProps {
  guild: GuildLevels['getDiscordGuild'];
  levels: Levels['levels'];
  roles: Levels['roles'];
}

export const getServerSideProps: GetServerSideProps<LeaderboardProps> = async (ctx) => {
  if (typeof ctx.params?.id !== 'string' || !isValidSnowflake(ctx.params.id)) return { notFound: true };

  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<GuildLevels>({
    query: GUILD_LEVELS,
    variables: { id: ctx.params.id, requireAuth: false },
  });

  if (!data.getDiscordGuild || !data.getGuildLevels) return { notFound: true };

  return {
    props: {
      guild: data.getDiscordGuild,
      levels: data.getGuildLevels.levels,
      roles: data.getGuildLevels.roles,
    },
  };
};

// export const getStaticPaths: GetStaticPaths = () => ({ fallback: true, paths: [] });

export default function Leaderboard({ guild, levels }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return (
      <div className="min-h-screen bg-discord-dark flex justify-center items-center">
        <Spinner className="w-60 h-auto" />
      </div>
    );
  }

  if (!guild || !levels.length) {
    return (
      <div className="min-h-screen bg-discord-dark flex justify-center items-center">
        <h1 className="text-white font-bold text-center text-xl sm:text-3xl">
          The guild you&apos;re trying to view either doesn&apos;t exist or does not have the leveling system enabled.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-discord-dark">
      <header className="flex flex-row justify-center">
        <img src="" alt="" />
        <p>{guild.name}</p>
      </header>
      <main></main>
    </div>
  );
}
