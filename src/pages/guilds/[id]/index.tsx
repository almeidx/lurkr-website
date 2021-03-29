import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { ChangeEvent, useContext, useState } from 'react';

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
  const { addChange, updateGuild } = useContext(GuildContext);
  const [prefix, setPrefix] = useState(db.prefix);
  const [storeCounts, setStoreCounts] = useState(db.storeCounts);

  if (isFallback) return <Loading />;

  function handlePrefixChange(event: ChangeEvent<HTMLInputElement>) {
    setPrefix(event.target.value);
    addChange('prefix', event.target.value);
  }

  function handleStoreCountsChange(event: ChangeEvent<HTMLInputElement>) {
    setStoreCounts(event.target.checked);
    addChange('storeCounts', event.target.checked);
  }

  updateGuild(guild, db);

  return (
    <Base guild={guild}>
      <label htmlFor="prefix">Prefix</label>
      <input value={prefix} onChange={handlePrefixChange} id="prefix" type="text" maxLength={5} />

      <div>
        <label htmlFor="storeCounts">Store Member Counts</label>
        <input checked={storeCounts} onChange={handleStoreCountsChange} id="storeCounts" type="checkbox" />
      </div>
    </Base>
  );
}
