import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';

import styles from '../../../styles/pages/bot/guilds/Guilds.module.css';
import { DISCORD_GUILD_CDN, DISCORD_PERMISSIONS, FALLBACK_AVATAR } from '../../../utils/constants';
import type { Guild } from '../../api/guilds';

export default function Servers() {
  const [guilds, setGuilds] = useState<Guild[] | null>(null);
  const [session] = useSession();

  useEffect(() => {
    if (session) {
      axios
        .get<Guild[]>('/api/guilds')
        .then(({ data }) =>
          setGuilds(
            data
              .filter((g) => (g.permissions & DISCORD_PERMISSIONS.MANAGE_GUILD) === DISCORD_PERMISSIONS.MANAGE_GUILD)
              .sort((a, b) => a.name.localeCompare(b.name)),
          ),
        )
        .catch(() => void 0);
    }
  }, [session]);

  if (!session) {
    return <h1>not logged in lul</h1>;
  }

  return (
    <div className={styles.container}>
      <main>
        {guilds ? (
          <>
            {guilds.map(({ icon, id, name }) => (
              <Link href={`/bot/guilds/${id}`} key={id}>
                <a>
                  <img src={DISCORD_GUILD_CDN(id, icon, false) ?? FALLBACK_AVATAR} alt={`${name} guild icon`} />
                  <span>{name}</span>
                </a>
              </Link>
            ))}
          </>
        ) : (
          'yeet'
        )}
      </main>
    </div>
  );
}
