import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { initializeApollo } from '../../../apollo/client';
import Base from '../../../components/dashboard/Base';
import Error from '../../../components/Error';
import { GuildContext } from '../../../contexts/GuildContext';
import { UserContext } from '../../../contexts/UserContext';
import MISC, { Misc } from '../../../graphql/dashboard/Misc';
import styles from '../../../styles/pages/guilds/Misc.module.css';

export interface GuildMiscProps {
  db: Misc['getDatabaseGuild'];
  guild: Misc['getDiscordGuild'];
}

export const getServerSideProps: GetServerSideProps<GuildMiscProps> = async ({ params, req }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  req.headers.accept = '';

  const apolloClient = initializeApollo(null, req.headers);

  const { data } = await apolloClient.query<Misc>({
    query: MISC,
    variables: { id: params.id },
  });

  return {
    props: {
      db: data.getDatabaseGuild,
      guild: data.getDiscordGuild,
    },
  };
};

export default function GuildMisc({ db, guild }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { addChange, updateGuild, changes, updateSelectedOption } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const router = useRouter();
  const [storeMilestones, setStoreMilestones] = useState(db?.storeMilestones);
  const [storeCounts, setStoreCounts] = useState(db?.storeCounts);

  useEffect(() => {
    if (!authenticated && guild) {
      void router.push(`/guilds/${guild.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db || !guild) {
    return <Error message="Count not find the guild you're looking for" statusCode={403} />;
  }

  function handleStoreCountsChange(event: ChangeEvent<HTMLInputElement>) {
    setStoreCounts(event.target.checked);
    addChange('storeCounts', event.target.checked);
  }

  function handleStoreMilestonesChange(event: ChangeEvent<HTMLInputElement>) {
    setStoreMilestones(event.target.checked);
    addChange('storeMilestones', event.target.checked);
  }

  updateSelectedOption('misc');
  updateGuild(guild.id);

  return (
    <Base guild={guild} option="misc">
      <div className={styles.horizontalSection}>
        <label htmlFor="storeCounts">Store Member Counts</label>
        <input
          checked={changes.storeCounts ?? storeCounts}
          id="storeCounts"
          onChange={handleStoreCountsChange}
          type="checkbox"
        />
      </div>

      <div className={styles.horizontalSection}>
        <label htmlFor="storeMilestones">Store Milestones</label>
        <input
          checked={changes.storeMilestones ?? storeMilestones}
          id="storeMilestones"
          onChange={handleStoreMilestonesChange}
          type="checkbox"
        />
      </div>

      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
