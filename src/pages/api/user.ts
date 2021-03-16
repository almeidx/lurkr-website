import axios from 'axios';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import type Adapters from 'next-auth/adapters';
import { getSession } from 'next-auth/client';

import { DISCORD_API_BASE_URL } from '../../utils/constants';
import { connectToDatabase } from '../../utils/mongodb';
import { noop } from '../../utils/utils';

type AccountSchema = Adapters['TypeORM']['Models']['Account']['model'];

export interface User {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type: boolean;
}

export default async function guilds(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ message: 'Could not resolve a valid session.' });

  const { db } = await connectToDatabase();

  const collection = db.collection<AccountSchema>('accounts');
  const account = await collection.findOne({
    // @ts-expect-error
    userId: ObjectId(session.user.id) as number,
  });

  if (!account || !account.accessToken) {
    return res.status(400).json({ message: 'Could not resolve a valid account for this session.' });
  }

  const response = await axios
    .get<User>('/users/@me', {
      baseURL: DISCORD_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    })
    .catch(noop);

  if (!response) return res.status(400).json({ message: 'The request towards Discord failed.' });

  return res.json(response.data);
}
