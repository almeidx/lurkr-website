import type { Snowflake } from 'discord-api-types/globals';
import Image from 'next/image';
import Link from 'next/link';

import { guildIconCdn } from '../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../utils/constants';

interface GuildProps {
  baseRedirectPath: string;
  icon: string | null;
  id: Snowflake;
  name: string;
}

export default function Guild({ baseRedirectPath, icon, id, name }: GuildProps) {
  return (
    <Link href={`${baseRedirectPath}${id}`} key={id}>
      <a className="flex flex-col flex-wrap gap-2 px-6 py-4 bg-discord-slightly-darker rounded-2xl w-40 h-44 text-center relative shadow-sm">
        {icon ? (
          <img
            alt={`${name} server icon`}
            className="rounded-lg"
            height={128}
            src={guildIconCdn(id, icon, 128)}
            width={128}
          />
        ) : (
          <Image className="rounded-lg" height={128} src={FALLBACK_AVATAR_PATH} width={128} />
        )}

        <span className="text-white w-[calc(100%-1rem)] absolute left-0 bottom-4 mx-2 truncate">{name}</span>
      </a>
    </Link>
  );
}
