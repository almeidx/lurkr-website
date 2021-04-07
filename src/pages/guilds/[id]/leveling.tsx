import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import Base from '../../../components/dashboard/Base';
import Error from '../../../components/Error';
import { GuildContext } from '../../../contexts/GuildContext';
import { UserContext } from '../../../contexts/UserContext';
import type { UserGuild } from '../../../graphql/UserGuild';

export interface GuildLevelingProps {
  db: UserGuild['getDatabaseGuild'];
  guild: UserGuild['getDiscordGuild'];
}

export { getServerSideProps } from '.';

export default function GuildLeveling({ db, guild }: GuildLevelingProps) {
  const { updateGuild, changes, updateSelectedOption } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!authenticated && guild) {
      void router.push(`/guilds/${guild.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db || !guild) {
    return <Error message="Count not find the guild you're looking for" statusCode={403} />;
  }

  updateSelectedOption('leveling');
  updateGuild(guild.id);

  return (
    <Base guild={guild} option="leveling">
      <h1>leveling</h1>
      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
