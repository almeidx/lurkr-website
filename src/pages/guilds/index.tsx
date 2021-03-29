import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import { useContext } from 'react';

import Error from '../../components/Error';
import { GuildsStoreContext } from '../../contexts/GuildsStoreContext';
import styles from '../../styles/pages/guilds/Dashboard.module.css';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../utils/constants';
import retrieveUserGuilds, { PartialGuild } from '../../utils/retrieveUserGuilds';

interface DashboardProps {
  guilds: PartialGuild[] | null;
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      props: {
        guilds: null,
      },
    };
  }

  const guilds = await retrieveUserGuilds(session);

  if (!guilds) {
    return { notFound: true };
  }

  return {
    props: {
      guilds,
    },
  };
};

export default function Dashboard({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { updateGuilds } = useContext(GuildsStoreContext);

  if (!guilds) {
    return <Error message="You need to be logged in to view this page." statusCode={401} />;
  }

  updateGuilds(guilds);

  return (
    <div className={styles.container}>
      {guilds.map(({ icon, id, name }) => (
        <Link href={`/guilds/${id}`} key={id}>
          <a>
            <img src={DISCORD_GUILD_CDN(id, icon, false) ?? FALLBACK_AVATAR} alt={`${name} guild icon`} />
            <span>{name}</span>
          </a>
        </Link>
      ))}
    </div>
  );
}
