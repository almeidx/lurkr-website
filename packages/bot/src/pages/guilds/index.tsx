import { PermissionFlagsBits } from 'discord-api-types/v8';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useContext } from 'react';

import Error from '../../components/Error';
import { UserContext } from '../../contexts/UserContext';
import { initializeApollo } from '../../graphql/client';
import USER_GUILDS, { UserGuilds } from '../../graphql/UserGuilds';
import styles from '../../styles/pages/guilds/Dashboard.module.scss';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../utils/constants';

const { MANAGE_GUILD } = PermissionFlagsBits;

interface DashboardProps {
  guilds: UserGuilds['getUserGuilds'] | null;
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (ctx) => {
  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<UserGuilds>({
    query: USER_GUILDS,
  });

  return {
    props: {
      guilds:
        data.getUserGuilds
          ?.filter((g) => (BigInt(g.permissions) & MANAGE_GUILD) === MANAGE_GUILD)
          .sort((a, b) => a.name.localeCompare(b.name)) ?? null,
    },
  };
};

export default function Dashboard({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { authenticated } = useContext(UserContext);

  if (!authenticated || !guilds) {
    return <Error message="You need to be logged in to view this page." statusCode={401} />;
  }

  if (!guilds.length) {
    return <h1>You have no servers</h1>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard - Pepe Manager</title>
      </Head>

      {guilds.map(({ icon, id, name }) => (
        <Link href={`/guilds/${id}`} key={id}>
          <a className={styles.guildContainer}>
            <img src={DISCORD_GUILD_CDN(id, icon, false) ?? FALLBACK_AVATAR} alt={`${name} guild icon`} />
            <span>{name}</span>
          </a>
        </Link>
      ))}
    </div>
  );
}
