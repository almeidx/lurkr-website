/* eslint-disable no-multi-assign */
import { Db, MongoClient } from 'mongodb';

interface MongoData {
  client: MongoClient;
  db: Db;
}

export interface MongoCache {
  conn: MongoData | null;
  promise: Promise<MongoData> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// @ts-expect-error
let cached = global.mongo as MongoCache;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!cached) {
  // @ts-expect-error
  cached = (global.mongo as MongoCache) = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((client) => {
      return {
        client,
        db: client.db(process.env.DATABASE_NAME),
      };
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
