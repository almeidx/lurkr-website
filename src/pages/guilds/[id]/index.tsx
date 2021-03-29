import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { useContext } from 'react';

import Base from '../../../components/dashboard/Base';
import Loading from '../../../components/Loading';
import { DatabaseGuild, GuildContext, GuildWithChannels } from '../../../contexts/GuildContext';
import api from '../../../services/api';
import retrieveUserGuilds from '../../../utils/retrieveUserGuilds';

interface APIResponse {
  db: DatabaseGuild;
  guild: GuildWithChannels;
  session: Session;
}

export const getServerSideProps: GetServerSideProps<APIResponse> = async (ctx) => {
  if (!ctx.params || typeof ctx.params.id !== 'string') return { notFound: true };

  try {
    const session = await getSession(ctx);

    if (!session) {
      return { notFound: true };
    }

    const userGuilds = await retrieveUserGuilds(session);
    if (!userGuilds?.some((g) => g.id === ctx.params!.id)) {
      return { notFound: true };
    }

    const response = await api.get<APIResponse>(`/guilds/${ctx.params.id}`).catch(() => null);
    if (!response?.data) return { notFound: true };

    return {
      props: {
        ...response.data,
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function Guild({ db, guild }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isFallback } = useRouter();
  const { updateGuild } = useContext(GuildContext);

  if (isFallback) return <Loading />;

  updateGuild(guild, db);

  return (
    <Base guild={guild}>
      <h1>test</h1>
    </Base>
  );
}
