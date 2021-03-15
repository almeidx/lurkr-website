import axios from 'axios';
import { Db, MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import type Adapters from 'next-auth/adapters';
import { getSession } from 'next-auth/client';

import { DISCORD_API_BASE_URL } from '../../utils/constants';
import { noop } from '../../utils/utils';

type AccountSchema = Adapters['TypeORM']['Models']['Account']['model'];

let cachedConnection: Db | null = null;

/**
 * Creates a connection to the database.
 */
async function connect() {
  if (cachedConnection) return cachedConnection;

  const client = await MongoClient.connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.DATABASE_NAME);

  cachedConnection = db;

  return db;
}

export default async function guilds(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ message: 'Could not resolve a valid session.' });

  const db = await connect();
  const collection = db.collection<AccountSchema>('accounts');

  const account = await collection.findOne({
    // @ts-expect-error
    userId: ObjectId(session.user.id) as number,
  });

  if (!account) return res.status(400).json({ message: 'Could not resolve a valid account for this session.' });

  const response = await axios
    .get('/users/@me/guilds', {
      baseURL: DISCORD_API_BASE_URL,
      headers: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        Authorization: `Bearer ${account.accessToken}`,
      },
    })
    .catch(noop);

  if (!response) return res.status(400).json({ message: 'The request towards Discord failed.' });

  return res.json(response.data);
}
