import axios from 'axios';
import { ObjectId } from 'bson';
import type { GuildFeature } from 'discord-api-types/v8';
import type { Session } from 'next-auth';
import type Adapters from 'next-auth/adapters';

import { DISCORD_API_BASE_URL, DISCORD_PERMISSIONS } from './constants';
import { connectToDatabase } from './mongodb';

export type AccountSchema = Adapters['TypeORM']['Models']['Account']['model'];

export interface PartialGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: number;
  features: GuildFeature[];
  permissions_new: string;
}

/**
 * Retrieves all the guilds which the current logged in user has MANAGE_GUILD permissions for
 * @param session This session
 */
export default async function retrieveUserGuilds(session: Session): Promise<PartialGuild[] | null> {
  const { db } = await connectToDatabase();

  const collection = db.collection<AccountSchema>('accounts');
  const account = await collection.findOne({
    // @ts-expect-error
    userId: ObjectId(session.user.id) as number,
  });

  if (!account?.accessToken) return null;

  const response = await axios
    .get<PartialGuild[]>('/users/@me/guilds', {
      baseURL: DISCORD_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    })
    .catch(() => null);

  const relevantGuilds = response?.data
    .filter((g) => (g.permissions & DISCORD_PERMISSIONS.MANAGE_GUILD) === DISCORD_PERMISSIONS.MANAGE_GUILD)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!relevantGuilds?.length) return null;

  return relevantGuilds;
}
